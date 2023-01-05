package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.api.request.DivisaoLancamentoDTO;
import com.dersaun.apigestaocontas.api.request.LancamentoDTO;
import com.dersaun.apigestaocontas.domain.Lancamento;
import com.dersaun.apigestaocontas.domain.Mes;
import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.dtos.DivisaoDTO;
import com.dersaun.apigestaocontas.domain.dtos.Parcelamento;
import com.dersaun.apigestaocontas.domain.services.*;
import com.dersaun.apigestaocontas.infra.exception.HttpException;
import com.dersaun.apigestaocontas.infra.repository.LancamentoRepository;
import com.dersaun.apigestaocontas.infra.utils.NumberUtils;
import com.dersaun.apigestaocontas.infra.utils.StringUtils;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.impl.list.mutable.FastList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class LancamentoServiceImpl implements LancamentoService {

    @Autowired
    private LancamentoRepository lancamentoRepository;

    @Autowired
    private LancamentoDivisaoService lancamentoDivisaoService;

    @Autowired
    private MesService mesService;

    @Autowired
    private FormaPagamentoService formaPagamentoService;

    @Autowired
    private ParcelaService parcelaService;


    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
    public Lancamento salvar(LancamentoDTO cadastrarLancamentoDTO) {
        Lancamento lancamento = prepararLancamentoFromDTO(cadastrarLancamentoDTO);


        if (cadastrarLancamentoDTO.isDividido()) {
            var resultadoDivisao = this.dividirLancamento(lancamento, cadastrarLancamentoDTO.getDivisao());
            lancamento.setLancamentos(resultadoDivisao.getLancamentos());
            lancamento.setValorDividido(resultadoDivisao.getValorLancamentoOriginal());
            lancamento.setDivisaoId(
                    resultadoDivisao.getTipoDivisao().getValor()
            );
        }

        if (lancamento.isParcelado()) {
            var parcelamentos = lancamento.getLancamentos().collect(lanc -> new Parcelamento(lanc, lanc.getMes()));
            parcelamentos.add(
                    new Parcelamento(lancamento, lancamento.getMes())

            );
            parcelaService.parcelar(parcelamentos);

        }

        return lancamentoRepository.save(lancamento);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class, noRollbackFor = HttpException.class)
    public void atualizar(Long id, LancamentoDTO lancamentoDTO) {
        var lancamento = lancamentoRepository.buscarPorId(id).orElseThrow(() -> HttpException.notFound("Lançamento não cadastrado"));

        if (lancamento.isReadOnly() && !UsuarioService.usuario().isAdmin()) {
            throw HttpException.badRequest("Conta indisponível para atualização, verifique com a pessoa que realizou o cadastro");
        }

        var mesAtual = mesService.getMesAtual();

        if (lancamentoDTO.isDivididoIgualmente()) {
            atualizarIgualmente(lancamento, lancamentoDTO, lancamentoDTO.getParcelado(), mesAtual);
        } else if (lancamentoDTO.isDivididoDiferente()) {
            atualizarDiferente(lancamento, lancamentoDTO, lancamentoDTO.getParcelado(), mesAtual);
        } else {
            atualizarContaNormal(lancamento, lancamentoDTO, lancamentoDTO.getParcelado(), mesAtual);
        }

    }

    private Lancamento prepararLancamentoFromDTO(LancamentoDTO cadastrarLancamentoDTO) {
        var lancamento = new Lancamento();
        lancamento.setNome(
                StringUtils.beautify(
                        cadastrarLancamentoDTO.getNome()
                )
        );
        lancamento.setDescricao(
                cadastrarLancamentoDTO.getDescricao()
        );

        lancamento.setValor(
                cadastrarLancamentoDTO.getValor()
        );

        lancamento.setDataCompra(
                cadastrarLancamentoDTO.getDataCompra()
        );

        lancamento.setAno(
                cadastrarLancamentoDTO.getDataCompra().getYear()
        );
        lancamento.setParcelado(cadastrarLancamentoDTO.getParcelado());
        lancamento.setQuantidadeParcelas(cadastrarLancamentoDTO.getQuantidadeParcelas());

        lancamento.setFormaPagamento(formaPagamentoService.buscarPorId(cadastrarLancamentoDTO.getFormaPagamentoId()));

        if (cadastrarLancamentoDTO.getMesReferencia() != null) {
            lancamento.setMes(new Mes(cadastrarLancamentoDTO.getMesReferencia()));

        } else {
            lancamento.setMes(
                    mesService.getFromDataCompraAndFormaPagamento(cadastrarLancamentoDTO.getDataCompra(), lancamento.getFormaPagamento())
            );
        }

        lancamento.setPessoa(
                new Pessoa(cadastrarLancamentoDTO.getIdPessoa())
        );
        lancamento.setPago(false);

        lancamento.setTipoConta(
                cadastrarLancamentoDTO.getFormaPagamentoId() == null ||
                        cadastrarLancamentoDTO.getFormaPagamentoId() == 0L ||
                        cadastrarLancamentoDTO.getFormaPagamentoId() == 7L ? 2 : 1);
        return lancamento;
    }


    @Override
    @Transactional
    public void apagar(Long idLancamento) {
        var lancamento = this.lancamentoRepository.buscarPorId(idLancamento)
                .orElseThrow(() -> HttpException.notFound("Lançamento não encontrado"));
        this.lancamentoRepository.delete(lancamento);
    }

    private DivisaoDTO dividirLancamento(Lancamento lancamento, DivisaoLancamentoDTO divisao) {
        if (divisao.isIgualmente()) {
            return this.lancamentoDivisaoService.dividirIgualmente(lancamento, divisao);
        } else {
            return this.lancamentoDivisaoService.dividirDiferente(lancamento, divisao);
        }
    }

    private void atualizarContaNormal(Lancamento lancamento, LancamentoDTO lancamentoDto, Boolean parcelado, Mes mesAtual) {
        Boolean eraParcelado = lancamento.getParcelado();

        var quantidadeParcelasOriginal = lancamento.getQuantidadeParcelas();

        newValuesToConta(lancamento, lancamentoDto);

        if (lancamento.isDividido() && !lancamentoDto.isDividido()) {
            removerContasDivididas(lancamento, false);
            lancamento.getLancamentos().clear();

        }


        parcelaService.atualizar(lancamento, eraParcelado, parcelado, Optional.ofNullable(quantidadeParcelasOriginal).orElse(0), mesAtual);
        this.lancamentoRepository.save(lancamento);
    }


    private void atualizarDiferente(Lancamento lancamento, LancamentoDTO lancamentoDto, Boolean parcelado, Mes mesAtual) {

        var mudouDivisao = isOutraDivisao(lancamento, lancamentoDto);

        var eraParcelado = lancamento.getParcelado();
        var quantidadeParcelasOriginal = eraParcelado ? lancamento.getQuantidadeParcelas() : 0;
        var redividir = osDevedoresMudaram(lancamento, lancamentoDto) || lancamento.getLancamentos().isEmpty() || mudouDivisao;

        newValuesToConta(lancamento, lancamentoDto);

        if (redividir) {
            removerContasDivididas(lancamento, false);

            lancamento.getLancamentos().clear();

            var resultadoDivisao = lancamentoDivisaoService.dividirDiferente(lancamento, lancamentoDto.getDivisao());

            lancamento.setLancamentos(resultadoDivisao.getLancamentos());

            lancamento.setValorDividido(resultadoDivisao.getValorLancamentoOriginal());

            lancamento.setDivisaoId(resultadoDivisao.getTipoDivisao().getValor());

        } else {
            if (lancamentoDto.isValorDivididoMaiorLancamento()) {
                throw HttpException.badRequest("O valor dividido do lançamento ultrapassou o valor total.");
            }
            Lancamento finalConta = lancamento;

            lancamento.getLancamentos().each(relacionado -> {

                var pessoaList = lancamentoDto.getDivisao().getPessoas()
                        .select(p -> Objects.equals(p.getId(), relacionado.getPessoa().getId()));

                var pessoa = pessoaList.get(0);
                updateRelacionado(relacionado, finalConta, pessoa.getValor());

            });
            lancamento.setValorDividido(lancamento.getValor().subtract(lancamentoDto.obterValorTotalDivisao()));
        }

        parcelaService.atualizar(lancamento, eraParcelado, parcelado, quantidadeParcelasOriginal, redividir, mesAtual);
        this.lancamentoRepository.save(lancamento);

    }

    public void atualizarIgualmente(Lancamento lancamento, LancamentoDTO lancamentoDto, Boolean parcelado, Mes mesAtual) {
        Boolean mudouDivisao = isOutraDivisao(lancamento, lancamentoDto);

        var eraParcelado = lancamento.getParcelado();
        var quantidadeParcelasOriginal = eraParcelado ? lancamento.getQuantidadeParcelas() : 0;

        newValuesToConta(lancamento, lancamentoDto);

        var redividir = osDevedoresMudaram(lancamento, lancamentoDto) || lancamento.getLancamentos().isEmpty() || mudouDivisao;

        if (redividir) {
            removerContasDivididas(lancamento, false);
            lancamento.getLancamentos().clear();
            var resultadoDivisao = lancamentoDivisaoService.dividirIgualmente(lancamento, lancamentoDto.getDivisao());
            lancamento.setValorDividido(resultadoDivisao.getValorLancamentoOriginal());
            lancamento.setDivisaoId(resultadoDivisao.getTipoDivisao().getValor());
            lancamento.setLancamentos(resultadoDivisao.getLancamentos());
        } else {
            var valorDividido = (lancamento.getValor().doubleValue() / (lancamentoDto.getDivisao().getPessoas().size() + 1));
            lancamento.setValorDividido(NumberUtils.roundValue(valorDividido));
            Lancamento finalConta = lancamento;
            lancamento.getLancamentos().each(relacionado -> updateRelacionado(relacionado, finalConta, finalConta.getValorDividido()));
        }

        parcelaService.atualizar(lancamento, eraParcelado, parcelado, quantidadeParcelasOriginal, redividir, mesAtual);
        this.lancamentoRepository.save(lancamento);
    }

    public void removerContasDivididas(Lancamento lancamento, Boolean removerTudo) {
        if (removerTudo) {
            List<Lancamento> toDelete = new ArrayList(Arrays.asList(lancamento.getLancamentos()));
            toDelete.add(lancamento);
            lancamentoRepository.deleteAll(toDelete);
        } else {
            lancamento.setDivisaoId(null);
            lancamento.setValorDividido(null);
            lancamentoRepository.deleteByLancamentoRelacionado(lancamento);
        }
    }

    private boolean isOutraDivisao(Lancamento lancamento, LancamentoDTO lancamentoDTO) {
        boolean mudouDivisao = false;

        if ((lancamentoDTO.isDivididoIgualmente() || lancamentoDTO.isDivididoDiferente()) && lancamento.getDivisaoId() == null) {
            mudouDivisao = true;
        } else if (lancamento.getDivisaoId() == 1 && lancamentoDTO.isDivididoDiferente()) {
            mudouDivisao = true;
        } else if (lancamento.getDivisaoId() == 2 && lancamentoDTO.isDivididoIgualmente()) {
            mudouDivisao = true;
        }
        return mudouDivisao;
    }

    private boolean osDevedoresMudaram(Lancamento lancamento, LancamentoDTO lancamentoDTO) {
        MutableList<Long> pessoasAtuais = FastList.newListWith(lancamento.getPessoa().getId());
        lancamento.getLancamentos().each(lan -> {
            pessoasAtuais.add(lan.getPessoa().getId());
        });


        if (lancamentoDTO.isDividido() && lancamento.getDivisaoId() == null) {
            return true;
        }  else if (lancamentoDTO.isDivididoIgualmente() && lancamento.getDivisaoId() == 1) {
            MutableList<Long> novosIgual = lancamentoDTO.obterPessoaIdsDivisao();

            if (pessoasAtuais.size() != novosIgual.size()) {
                return true;
            }
            novosIgual.removeIf(pessoasAtuais::contains);
            return novosIgual.size() > 0;

        } else if (lancamentoDTO.isDivididoDiferente() && lancamento.getDivisaoId() == 2) {

            var novos = lancamentoDTO.obterPessoaIdsDivisao();

            if (pessoasAtuais.size() != novos.size()) {
                return true;
            }
            novos.removeIf(pessoasAtuais::contains);

            return novos.size() > 0;
        }
        return false;

    }

    private void updateRelacionado(Lancamento relacionado, Lancamento lancamento, BigDecimal valorDividido) {
        relacionado.setNome(lancamento.getNome());
        relacionado.setDescricao(lancamento.getDescricao());
        relacionado.setValor(lancamento.getValor());
        relacionado.setFormaPagamento(lancamento.getFormaPagamento());
        relacionado.setParcelado(lancamento.getParcelado());
        relacionado.setQuantidadeParcelas(lancamento.getQuantidadeParcelas());
        relacionado.setTipoConta(lancamento.getTipoConta());
        relacionado.setMes(lancamento.getMes());
        relacionado.setDivisaoId(lancamento.getDivisaoId());
        relacionado.setValorDividido(valorDividido);
    }

    /**
     * Reassign basic new values to conta
     * Rever valor dividido caso seja dividido
     * Parcelas etc.
     *
     * @return
     */
    private void newValuesToConta(Lancamento lancamento, LancamentoDTO lancamentoDTO) {

        lancamento.setNome(lancamentoDTO.getNome());
        lancamento.setDescricao(lancamentoDTO.getDescricao());
        lancamento.setValor(lancamentoDTO.getValor());
        lancamento.setParcelado(lancamentoDTO.getParcelado());
        lancamento.setQuantidadeParcelas(lancamentoDTO.getQuantidadeParcelas());

        if (lancamento.getPessoa().getId() != lancamentoDTO.getIdPessoa()) {
            lancamento.setPessoa(new Pessoa(lancamentoDTO.getIdPessoa()));
        }

        if (lancamento.getFormaPagamento().getId() != lancamentoDTO.getFormaPagamentoId()) {
            lancamento.setFormaPagamento(formaPagamentoService.buscarPorId(lancamentoDTO.getFormaPagamentoId()));
        }
        if (!lancamento.getDataCompra().equals(lancamentoDTO.getDataCompra())) {
            lancamento.setDataCompra(lancamentoDTO.getDataCompra());
            lancamento.setMes(mesService.getFromDataCompraAndFormaPagamento(lancamento.getDataCompra(), lancamento.getFormaPagamento()));
        }
        lancamento.setTipoConta(lancamento.getFormaPagamento() == null || lancamento.getFormaPagamento().getId() == 7 ? 2 : 1);

        if (lancamentoDTO.isDivididoDiferente()) {
            lancamento.setDivisaoId(2);
        } else if (lancamentoDTO.isDivididoIgualmente()) {
            lancamento.setDivisaoId(1);
        } else {
            lancamento.setDivisaoId(null);
        }
        lancamento.setValorDividido(null);
    }
}
