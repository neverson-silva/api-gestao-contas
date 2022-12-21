package com.dersaun.apigestaocontas.infra.repository;

import com.dersaun.apigestaocontas.domain.FormaPagamento;
import org.eclipse.collections.api.list.MutableList;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormaPagamentoRepository  extends JpaRepository<FormaPagamento, Long> {

    @EntityGraph(attributePaths = {"dono"})
    MutableList<FormaPagamento> findAllByAtivoIsTrueOrderByNomeAsc();

    @EntityGraph(attributePaths = {"dono"})
    MutableList<FormaPagamento> findAllByDonoIdAndAtivoIsTrueOrderByNomeAsc(Long idPessoa);
}
