package com.dersaun.apigestaocontas.infra.repository;

import com.dersaun.apigestaocontas.domain.Lancamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LancamentoRepository extends JpaRepository<Lancamento, Long> {

    @Query("""
        from Lancamento l 
        inner join fetch l.mes mes 
        inner join fetch l.pessoa pessoa 
        inner join fetch l.formaPagamento formaPagamento 
        left join fetch l.lancamentoRelacionado 
        left join fetch l.lancamentos lancamentos
        left join fetch lancamentos.mes mesLancamentos
        left join fetch lancamentos.pessoa pessoaLancamentos
        left join fetch lancamentos.formaPagamento formaPagamentoLancamentos 
        where l.id = :id
        
    """)
    Optional<Lancamento> buscarPorId(@Param("id") Long id);

    @Modifying()
    @Query("delete from Lancamento where lancamentoRelacionado = ?1")
    void deleteByLancamentoRelacionado(Lancamento lancamento);

}
