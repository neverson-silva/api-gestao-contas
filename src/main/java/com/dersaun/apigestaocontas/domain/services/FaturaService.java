package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.api.request.BuscarLancamentosFaturaRequestDTO;
import com.dersaun.apigestaocontas.domain.FaturaItem;
import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.dtos.MesAnoDTO;
import com.dersaun.apigestaocontas.domain.dtos.PaginationDTO;
import org.eclipse.collections.api.list.MutableList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FaturaService {

    /**
     * Recuperar todos os itens da fatura por mes e ano
     *
     * @param mesAnoDto
     * @return
     */
    MutableList<FaturaItem> getFaturaItemsByMesAno(MesAnoDTO mesAnoDto);

    /**
     * Recuperar todos os items da fatura por mes e ano, e valida se é somente ativos
     *
     * @param mesAnoDto
     * @param somentAtivos
     * @return
     */
    MutableList<FaturaItem> getFaturaItemsByMesAno(MesAnoDTO mesAnoDto, Boolean somentAtivos);

    /**
     * Recupera itens da fatura por mes e ano com paginação
     *
     * @param mesAnoDto
     * @param somentAtivos
     * @param pageable
     * @return
     */
    Page<FaturaItem> getFaturaItemsByMesAno(MesAnoDTO mesAnoDto, Boolean somentAtivos, Pageable pageable, String searchKey);

    /**
     * Recupera itens da fatura por mes e ano por pessoa com paginação
     *
     * @param mesAnoDto
     * @param pessoa
     * @param pageable
     * @return
     */
    Page<FaturaItem> getFaturaItemsByMesAnoAndPessoa(MesAnoDTO mesAnoDto, Pessoa pessoa, Pageable pageable, String searchKey);

    /**
     * Recupera itens da fatura por mes e ano por pessoa com paginação
     *
     * @param mesAnoDto
     * @param pessoa
     * @param pageable
     * @param somenteAtivos
     * @return
     */
    Page<FaturaItem> getFaturaItemsByMesAnoAndPessoa(MesAnoDTO mesAnoDto, Pessoa pessoa,
                                                     Pageable pageable,
                                                     Boolean somenteAtivos, String searchKey);

    Page<FaturaItem> buscarItensFaturaAtual(PaginationDTO paginationDTO);

    Page<FaturaItem> buscarItensFatura(BuscarLancamentosFaturaRequestDTO paramsRequest);
}
