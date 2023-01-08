package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.ResumoFatura;
import com.dersaun.apigestaocontas.domain.dtos.*;
import com.dersaun.apigestaocontas.domain.services.ResumoFaturaService;
import com.dersaun.apigestaocontas.domain.services.UsuarioService;
import com.dersaun.apigestaocontas.infra.repository.MesRepository;
import com.dersaun.apigestaocontas.infra.repository.ResumoFaturaRepository;
import com.dersaun.apigestaocontas.infra.utils.MesUtils;
import com.dersaun.apigestaocontas.infra.utils.NumberUtils;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.impl.list.mutable.FastList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.*;


@Service
public class ResumoFaturaServiceImpl implements ResumoFaturaService {

    @Autowired
    private MesRepository mesRepository;

    @Autowired
    private ResumoFaturaRepository resumoFaturaRepository;

    @Autowired
    private EntityManager em;

    @Override
    public ResumoFormaPagamentoMensalResponseDTO buscarResumoPagamentos(MesAnoDTO mesAnoDTO, Long idPessoa) {
        var mesAnoAnterior = MesUtils.getMesAnoAnterior(mesAnoDTO);

        var resumos = resumoFaturaRepository.findAllByPessoaIdAndMesAndAno(
                idPessoa, mesAnoDTO.getMesReferencia(), mesAnoDTO.getAnoReferencia()
        );

        var resumosAnteriores = resumoFaturaRepository.findAllByPessoaIdAndMesAndAno(
                idPessoa, mesAnoAnterior.getMesReferencia(), mesAnoAnterior.getAnoReferencia()
        );

        var resumosPagamentos = new ResumoFormaPagamentoMensalResponseDTO();

        var cartaoAvistaAtual = getResumosCartaoAvista(resumos);
        var dinheiroAtual = getResumosDinheiro(resumos);
        var parceladoAtual = getResumosParcelados(resumos);


        var valorCartaoAvista = NumberUtils.somar(cartaoAvistaAtual);
        var valorDinheiro = NumberUtils.somar(dinheiroAtual);
        var valorParcelado = NumberUtils.somar(parceladoAtual);
        var valorTotal = NumberUtils.somar(
                resumos.collect(ResumoFatura::getValorTotal).toList()
        );

        var valorCartaoAnterior = NumberUtils.somar(
                getResumosCartaoAvista(resumosAnteriores)
        );

        var valorDinheiroAnterior = NumberUtils.somar(
                getResumosDinheiro(resumosAnteriores)
        );

        var valorParceladoAnterior = NumberUtils.somar(
                getResumosParcelados(resumosAnteriores)
        );

        var valorTotalAnterior = NumberUtils.somar(
                resumosAnteriores.collect(ResumoFatura::getValorTotal).toList()
        );

        var diferencaCartao = calcularPorcentagemDiferenca(valorCartaoAnterior.doubleValue(), valorCartaoAvista.doubleValue());
        var diferencaDinheiro = calcularPorcentagemDiferenca(valorDinheiroAnterior.doubleValue(), valorDinheiro.doubleValue());
        var diferencaParcelado = calcularPorcentagemDiferenca(valorParceladoAnterior.doubleValue(), valorParcelado.doubleValue());
        var diferencaTotal = calcularPorcentagemDiferenca(valorTotalAnterior.doubleValue(), valorTotal.doubleValue());

        resumosPagamentos.setCartao(
                new ResumoFormaPagamentoMensalDTO(
                        "Cartão à vista",
                        valorCartaoAvista,
                        diferencaCartao,
                        "green"
                )
        );

        resumosPagamentos.setDinheiro(
                new ResumoFormaPagamentoMensalDTO(
                        "Dinheiro",
                        valorDinheiro,
                        diferencaDinheiro,
                        "blue"
                )
        );

        resumosPagamentos.setParcelado(
                new ResumoFormaPagamentoMensalDTO(
                        "Parcelado",
                        valorParcelado,
                        diferencaParcelado,
                        "violet"
                )
        );

        resumosPagamentos.setTotal(
                new ResumoFormaPagamentoMensalDTO(
                        "Total",
                        valorTotal,
                        diferencaTotal,
                        "cyan"
                )
        );

        return resumosPagamentos;
    }

    private MutableList<BigDecimal> getResumosCartaoAvista(MutableList<ResumoFatura> resumosFaturas) {
        return resumosFaturas.select(resumo -> resumo.isCartaoAvista()).collect(resumo -> resumo.getValorAVista());
    }

    private MutableList<BigDecimal> getResumosDinheiro(MutableList<ResumoFatura> resumosFaturas) {
        return resumosFaturas.select(resumoFatura -> resumoFatura.getFormaPagamento().isDinheiro())
                .collect(resumoFatura -> resumoFatura.getValorAVista());
    }

    private MutableList<BigDecimal> getResumosParcelados(MutableList<ResumoFatura> resumosFaturas) {
        return resumosFaturas.select(resumo -> resumo.isParcelado())
                .collect(resumoFatura -> resumoFatura.getValorParcelado());
    }

    private Double calcularPorcentagemDiferenca(Double valorAnterior, Double valorAtual) {
        try {
            if (valorAnterior == 0D && valorAtual == 0D) {
                return 0D;
            }

            if (valorAnterior == 0D || valorAtual == 0D) {
                return valorAnterior > valorAtual ? -100D : 100D;
            }

            var percentual = (valorAtual / valorAnterior - 1) * 100;

            return NumberUtils.roundValue(percentual).doubleValue();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResumoFormaPagamentoMensalResponseDTO buscarResumoPagamentosMesAtual(Long idPessoa) {
        var mesAnoDto = MesUtils.getMesAno(mesRepository.buscarMesAtual());
        return buscarResumoPagamentos(mesAnoDto, idPessoa);
    }

    @Override
    public List<ResumoFaturaPessoas> resumoFaturaPessoas(MesAnoDTO mesAnoDTO) {
        var mesAnoAnterior = MesUtils.getMesAnoAnterior(mesAnoDTO);
        var usuarioAdmin = UsuarioService.usuario().isAdmin();

        FastList<ResumoFatura> resumosFaturaMesAtual;

        if (usuarioAdmin) {
            resumosFaturaMesAtual = resumoFaturaRepository.findAllBydMesAndAno(
                    mesAnoDTO.getMesReferencia(), mesAnoDTO.getAnoReferencia()
            );
        } else {
            resumosFaturaMesAtual = resumoFaturaRepository.findByMesAndAnoAndPessoas(mesAnoDTO.getMesReferencia(),
                    mesAnoDTO.getAnoReferencia(), Collections.singletonList(UsuarioService.ifNotAdminGetPessoa().getId()));
        }



        var resumosFaturaPorPessoa = resumosFaturaMesAtual.groupBy(ResumoFatura::getPessoa);

        var resumosMesAnteriorPorPessoa = resumoFaturaRepository.findByMesAndAnoAndPessoas(
                mesAnoAnterior.getMesReferencia(),
                mesAnoAnterior.getAnoReferencia(),
                resumosFaturaPorPessoa.keySet().collect(Pessoa::getId).toList()
        );

        var resumosFaturaPessoaMesAnterior = resumosMesAnteriorPorPessoa.groupBy(ResumoFatura::getPessoa);

        var resumosResponseList = new FastList<ResumoFaturaPessoas>();

        resumosFaturaPorPessoa.forEachKeyMultiValues((pessoa, resumosFatura) -> {

            var valorMesAtual = FastList.newList(resumosFatura)
                    .collect(ResumoFatura::getValorTotal)
                    .reduce((acumulador, valorAtual) ->
                            NumberUtils.roundValue(acumulador.doubleValue() + valorAtual.doubleValue())
                    ).orElse(BigDecimal.ZERO);

            BigDecimal valorMesAnterior = BigDecimal.ZERO;

            if (resumosFaturaPessoaMesAnterior.containsKey(pessoa)) {
                valorMesAnterior = resumosFaturaPessoaMesAnterior.get(pessoa)
                        .collect(ResumoFatura::getValorTotal)
                        .reduce((acumulador, valorAtual) ->
                                NumberUtils.roundValue(acumulador.doubleValue() + valorAtual.doubleValue())
                        ).orElse(BigDecimal.ZERO);
            }

            ResumoFaturaPessoas resumoFaturaPessoa = new ResumoFaturaPessoas();
            resumoFaturaPessoa.setPessoa(pessoa);
            resumoFaturaPessoa.setResumos(FastList.newList(resumosFatura).sortThisBy(rf -> rf.getFormaPagamento().getNome()));
            resumoFaturaPessoa.setValorMesAtual(valorMesAtual);
            resumoFaturaPessoa.setValorMesAnterior(valorMesAnterior);

            resumosResponseList.add(resumoFaturaPessoa);

        });

        return resumosResponseList.sortThisBy(response -> response.getPessoa().getNome());
    }

    @Override
    @SuppressWarnings("unchecked")
    public MutableList<ResumoFatura> buscarResumoFaturasPorMesAnos(MutableList<? extends MesAnoChartDTO> meses, Pessoa pessoa) {
        String sql = " select rf " +
                "from ResumoFatura rf " +
                "inner join fetch rf.formaPagamento fp " +
                "inner join fetch rf.pessoa p " +
                "left join fetch fp.dono dono " +
//                "inner join fetch rf.mes m " +
                "where 1 = 1 ";
        Map<String, Object> params = new LinkedHashMap<>();

        if (pessoa != null) {
            sql += " and p.id = :pessoaId";
            params.put("pessoaId", pessoa.getId());
        }

        var and = meses.collectWithIndex((mesAno, index) -> {
            var mesPlaceholder = ":mes" + index;
            var anoPlaceholder = ":ano" + index;
            params.put(mesPlaceholder.replace(":", ""), mesAno.getFechamento());
            params.put(anoPlaceholder.replace(":", ""), mesAno.getAnoFechamento());

            return " ( rf.id.mesId = " + mesPlaceholder + " and rf.id.ano = " + anoPlaceholder + " ) ";
        }).makeString(" or \n");

        sql +=  " and ( " + and + ") ";
        var query = em.createQuery(sql, ResumoFatura.class);

        params.forEach(query::setParameter);

        var valores = query.getResultList();

        return new FastList<>(valores);
    }
}
