package com.dersaun.apigestaocontas.infra.repository;

import com.dersaun.apigestaocontas.domain.ResumoFatura;
import com.dersaun.apigestaocontas.domain.identities.ResumoFaturaIdentity;
import org.eclipse.collections.impl.list.mutable.FastList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ResumoFaturaRepository  extends JpaRepository<ResumoFatura, ResumoFaturaIdentity> {

    @Query("select rf " +
            "from ResumoFatura as rf " +
            "inner join fetch rf.pessoa " +
            "inner join fetch rf.formaPagamento formaPagamento " +
            "left join fetch formaPagamento.dono " +
//            "inner join fetch rf.mes " +
            "where rf.id.pessoaId = ?1 " +
            "and rf.id.mesId = ?2 " +
            "and rf.id.ano = ?3")
    FastList<ResumoFatura> findAllByPessoaIdAndMesAndAno(Long pessoaId, Long mesId, Integer ano);

    @Query("select rf " +
            "from ResumoFatura as rf " +
            "inner join fetch rf.pessoa pessoa " +
            "inner join fetch rf.formaPagamento formaPagamento " +
            "left join fetch formaPagamento.dono " +
//            "inner join fetch rf.mes " +
            "where rf.id.mesId = ?1 " +
            "and rf.id.ano = ?2 " +
            "order by pessoa.nome ASC ")
    FastList<ResumoFatura> findAllBydMesAndAno(Long mesId, Integer ano);

    @Query("select rf " +
            "from ResumoFatura as rf " +
            "inner join fetch rf.pessoa pessoa " +
            "inner join fetch rf.formaPagamento formaPagamento " +
            "left join fetch formaPagamento.dono " +
            "where rf.id.mesId = ?1 " +
            "and rf.id.ano = ?2 " +
            "and pessoa.id in (?3) " +
            "order by pessoa.nome ASC")
    FastList<ResumoFatura> findByMesAndAnoAndPessoas(Long mesId, Integer ano, List<Long> idsPessoas);
}
