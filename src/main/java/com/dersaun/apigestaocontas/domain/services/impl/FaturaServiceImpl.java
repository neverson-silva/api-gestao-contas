package com.dersaun.apigestaocontas.domain.services.impl;

import com.dersaun.apigestaocontas.api.request.BuscarLancamentosFaturaRequestDTO;
import com.dersaun.apigestaocontas.domain.FaturaItem;
import com.dersaun.apigestaocontas.domain.Lancamento;
import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.dtos.MesAnoDTO;
import com.dersaun.apigestaocontas.domain.dtos.PaginationDTO;
import com.dersaun.apigestaocontas.domain.services.FaturaService;
import com.dersaun.apigestaocontas.domain.services.PaginationService;
import com.dersaun.apigestaocontas.domain.services.ParcelaService;
import com.dersaun.apigestaocontas.domain.services.UsuarioService;
import com.dersaun.apigestaocontas.infra.repository.FaturaItemRepository;
import com.dersaun.apigestaocontas.infra.repository.MesRepository;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.impl.list.mutable.FastList;
import org.hibernate.Hibernate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FaturaServiceImpl implements FaturaService {

    @Autowired
    private MesRepository mesRepository;

    @Autowired
    private FaturaItemRepository faturaItemRepository;

    @Override
    public Page<FaturaItem> buscarItensFaturaAtual(PaginationDTO paginationDTO) {
        var mes = mesRepository.buscarMesAtual();
        var mesAnoDto = new MesAnoDTO(mes.getId(), LocalDate.now().getYear());
        var buscarItensRequest = new BuscarLancamentosFaturaRequestDTO();

        BeanUtils.copyProperties(paginationDTO, buscarItensRequest);

        buscarItensRequest.setAno(mesAnoDto.getAnoReferencia());
        buscarItensRequest.setMes(mesAnoDto.getMesReferencia());
        buscarItensRequest.setIdPessoa(null);
        buscarItensRequest.setOrderBy("lancamento.dataCompra");
        return buscarItensFatura(buscarItensRequest);

    }

    @Override
    public Page<FaturaItem> buscarItensFatura(BuscarLancamentosFaturaRequestDTO paramsRequest) {
        var usuario = UsuarioService.usuario();
        Pageable pageRequest = PaginationService.createPageable(paramsRequest);

        if (usuario.isAdmin() && paramsRequest.getIdPessoa() == null) {
            var itens = getFaturaItemsByMesAno(
                    paramsRequest.getMesAno(),
                    paramsRequest.getSomenteAtivos(),
                    pageRequest,
                    Optional.ofNullable(paramsRequest.getSearchKey()).orElse("")
                    );
            var itensFatura = mapItensRelacionados(itens);
            return itensFatura;
        } else {
            var itens = getFaturaItemsByMesAnoAndPessoa(
                    paramsRequest.getMesAno(),
                    usuario.isAdmin() ? new Pessoa(paramsRequest.getIdPessoa()) : usuario.getPessoa(),
                    pageRequest,
                    paramsRequest.getSomenteAtivos(),
                    Optional.ofNullable(paramsRequest.getSearchKey()).orElse("")

            );
            return mapItensRelacionadosNotAdmin(itens);

        }

    }

    /**
     * Recuperar todos os itens da fatura por mes e ano
     *
     * @param mesAnoDto
     * @return
     */
    @Override
    public MutableList<FaturaItem> getFaturaItemsByMesAno(MesAnoDTO mesAnoDto) {
        return getFaturaItemsByMesAno(mesAnoDto, false);
    }

    /**
     * Recuperar todos os items da fatura por mes e ano, e valida se é somente ativos
     *
     * @param mesAnoDto
     * @param somentAtivos
     * @return
     */
    @Override
    public MutableList<FaturaItem> getFaturaItemsByMesAno(MesAnoDTO mesAnoDto, Boolean somentAtivos) {
        if (somentAtivos) {
            return faturaItemRepository.findAllByFechamentoAndAnoAndNotPago(
                    mesAnoDto.getMesReferencia(),
                    mesAnoDto.getAnoReferencia()
            );
        }
        return faturaItemRepository.findAllByFechamentoAndAno(
                mesAnoDto.getMesReferencia(),
                mesAnoDto.getAnoReferencia()
        );
    }

    /**
     * Recupera itens da fatura por mes e ano com paginação
     *
     * @param mesAnoDto
     * @param somentAtivos
     * @param pageable
     * @return
     */
    @Override
    public Page<FaturaItem> getFaturaItemsByMesAno(MesAnoDTO mesAnoDto, Boolean somentAtivos, Pageable pageable, String searchKey) {
        if (somentAtivos) {
            return faturaItemRepository.findAllByFechamentoAndAnoAndNotPago(
                    mesAnoDto.getMesReferencia(),
                    mesAnoDto.getAnoReferencia(),
                    pageable,
                    searchKey
            );
        }
        return faturaItemRepository.findAllByFechamentoAndAno(
                mesAnoDto.getMesReferencia(),
                mesAnoDto.getAnoReferencia(),
                pageable,
                searchKey
        );
    }

    /**
     * Recupera itens da fatura por mes e ano por pessoa com paginação
     *
     * @param mesAnoDto
     * @param pessoa
     * @param pageable
     * @return
     */
    @Override
    public Page<FaturaItem> getFaturaItemsByMesAnoAndPessoa(MesAnoDTO mesAnoDto, Pessoa pessoa, Pageable pageable, String searchKey) {
        return getFaturaItemsByMesAnoAndPessoa(mesAnoDto, pessoa, pageable, false, searchKey);

    }

    /**
     * Recupera itens da fatura por mes e ano por pessoa com paginação
     *
     * @param mesAnoDto
     * @param pessoa
     * @param pageable
     * @param somenteAtivos
     * @return
     */
    @Override
    public Page<FaturaItem> getFaturaItemsByMesAnoAndPessoa(MesAnoDTO mesAnoDto,
                                                            Pessoa pessoa,
                                                            Pageable pageable,
                                                            Boolean somenteAtivos,
                                                            String searchKey) {
        if (somenteAtivos) {
            var valores = faturaItemRepository.findAllByFechamentoAndAnoAndPessoaAndNotPago(
                    mesAnoDto.getMesReferencia(),
                    mesAnoDto.getAnoReferencia(),
                    pessoa,
                    pageable,
                    searchKey
            );
            return valores;
        }
        return faturaItemRepository.findAllByFechamentoAndAnoAndPessoa(
                mesAnoDto.getMesReferencia(),
                mesAnoDto.getAnoReferencia(),
                pessoa,
                pageable,
                searchKey
        );
    }


    public Page<FaturaItem> mapItensRelacionados(Page<FaturaItem> itens) {

        itens.forEach(faturaItem -> {
            if (faturaItem.isDividido() && faturaItem.hasLancamentosDivididos()) {
                var itensRelacionados = buildFaturaItemRelacionado(faturaItem, faturaItem.getLancamento().getLancamentos());
                faturaItem.addAllFaturaItemRelacionado(itensRelacionados);
            }
        });

        return itens;
    }

    public Page<FaturaItem> mapItensRelacionadosNotAdmin(Page<FaturaItem> itens) {

        for (FaturaItem faturaItem : itens) {
            if (faturaItem.isDividido()) {

                MutableList<Lancamento> lancamentos = new FastList<>();
                if (faturaItem.isPrincipal() && faturaItem.hasLancamentosDivididos()) {
                    lancamentos.addAll(faturaItem.getLancamento().getLancamentos());
                } else if (faturaItem.getLancamentoRelacionado().hasLancamentosDivididos()) {
                    lancamentos.add(faturaItem.getLancamentoRelacionado());
                    lancamentos.addAll(faturaItem.getLancamentoRelacionado().getLancamentos());
                }

                var itensRelacionados = buildFaturaItemRelacionado(faturaItem, lancamentos);
                faturaItem.addAllFaturaItemRelacionado(itensRelacionados);
            }
        }

        return itens;
    }

    public List<FaturaItem> mapItensRelacionados(List<FaturaItem> itens) {
        itens.forEach(faturaItem -> {
            if (faturaItem.isDividido() && faturaItem.hasLancamentosDivididos()) {
                var itensRelacionados = buildFaturaItemRelacionado(faturaItem, faturaItem.getLancamento().getLancamentos());
                faturaItem.addAllFaturaItemRelacionado(itensRelacionados);
            }
        });

        return itens;
    }

    public FaturaItem mapItensRelacionados(FaturaItem faturaItem) {

        if (faturaItem.isDividido() && (faturaItem.hasLancamentosDivididos() ||
                (!UsuarioService.usuario().isAdmin() && faturaItem.getLancamentoRelacionado().hasLancamentosDivididos()))) {
            MutableList<Lancamento> lancamentos = new FastList<>();
            if (UsuarioService.usuario().isAdmin()) {
                lancamentos.addAll(faturaItem.getLancamento().getLancamentos());
            } else {
                if (faturaItem.isPrincipal()) {
                    lancamentos.addAll(faturaItem.getLancamento().getLancamentos());
                } else {
                    lancamentos.add(faturaItem.getLancamentoRelacionado());
                    lancamentos.addAll(faturaItem.getLancamentoRelacionado().getLancamentos());
                }
            }
            var itensRelacionados = buildFaturaItemRelacionado(faturaItem, lancamentos);
            faturaItem.addAllFaturaItemRelacionado(itensRelacionados);
        }
        return faturaItem;
    }

    private MutableList<FaturaItem> buildFaturaItemRelacionado(FaturaItem faturaItem, MutableList<Lancamento> lancamentoList) {

        return lancamentoList.reject(con -> con.getId().equals(faturaItem.getLancamento().getId()))
                .collect(conta -> {
                    try {
                        long id = (long) (Math.random() * ((faturaItem.getId() * 2) - faturaItem.getId() + 1) + faturaItem.getId());

                        FaturaItem fatItem = new FaturaItem();
                        fatItem.setId(id);
                        fatItem.setFechamento(faturaItem.getFechamento());
                        fatItem.setAno(faturaItem.getAno());
                        if (faturaItem.isParcelado()) {
                            fatItem.setParcela(ParcelaService.createMockParcela(conta, faturaItem.getParcela()));
                        }
                        conta.setPessoa((Pessoa) Hibernate.unproxy(conta.getPessoa()));
                        fatItem.setLancamento(conta);
                        fatItem.setPessoaId(conta.getPessoa().getId());

                        return fatItem;
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    }
                    return new FaturaItem();
                });

    }
}
