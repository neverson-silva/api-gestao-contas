package com.dersaun.apigestaocontas.infra.repository;

import com.dersaun.apigestaocontas.domain.FormaPagamento;
import com.dersaun.apigestaocontas.domain.Pessoa;
import org.eclipse.collections.api.list.MutableList;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.Nullable;

public interface FormaPagamentoRepository extends JpaRepository<FormaPagamento, Long> {

    @EntityGraph(attributePaths = {"dono"})
    MutableList<FormaPagamento> findAllByAtivoIsTrueOrderByNomeAsc();

    @EntityGraph(attributePaths = {"dono"})
    MutableList<FormaPagamento> findAllByDonoIdAndAtivoIsTrueOrderByNomeAsc(Long idPessoa);

    /*and (
    ( :pessoa is not null and ( fp.dono = :pessoa or fp.id in (6L, 7L) ) ) or (:pessoa is null)
    )*/
    @Query("""
            from FormaPagamento fp 
            left join fetch fp.dono dono 
            where exists (
                select fi.id
                from FaturaItem fi
                where fi.lancamento.formaPagamento = fp
                and fi.fechamento = :mesReferencia
                and fi.ano = :anoReferencia
                and fi.lancamento.pessoa = COALESCE(:pessoa, fi.lancamento.pessoa) 
            )
            order by fp.nome ASC
                
            """)
    MutableList<FormaPagamento> buscarFormasPagamentosComCompras(@Param("mesReferencia") Long mesReferencia,
                                                                 @Param("anoReferencia") Integer anoReferencia,
                                                                 @Param("pessoa") @Nullable Pessoa pessoa);
}
