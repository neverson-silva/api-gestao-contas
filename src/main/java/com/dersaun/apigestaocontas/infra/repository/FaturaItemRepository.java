package com.dersaun.apigestaocontas.infra.repository;

import com.dersaun.apigestaocontas.domain.FaturaItem;
import com.dersaun.apigestaocontas.domain.Pessoa;
import org.eclipse.collections.impl.list.mutable.FastList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FaturaItemRepository extends JpaRepository<FaturaItem, Long> {

    @Query("select fa " +
            "from FaturaItem fa " +
            "left join fetch fa.parcela pa " +
            "inner join fetch pa.mesReferencia " +
            "inner join fetch fa.lancamento lancamento " +
            "inner join fetch lancamento.pessoa " +
            "inner join fetch lancamento.formaPagamento formaPagamento " +
            "inner join fetch lancamento.mes " +
            "left join fetch lancamento.lancamentoRelacionado " +
            "where fa.fechamento = :fechamento " +
            "and fa.ano = :ano " +
            "and (lancamento.pago <> true or lancamento.parcelado = true and pa.pago <> true)" +
            "order by lancamento.dataCompra desc")
    FastList<FaturaItem> findAllByFechamentoAndAnoAndNotPago(@Param("fechamento") Long fechamento,
                                                             @Param("ano") Integer ano);


    @Query("select fa " +
            "from FaturaItem fa " +
            "left join fetch fa.parcela pa " +
            "inner join fetch pa.mesReferencia " +
            "inner join fetch fa.lancamento lancamento " +
            "inner join fetch lancamento.pessoa " +
            "inner join fetch lancamento.formaPagamento formaPagamento " +
            "inner join fetch lancamento.mes " +
            "left join fetch lancamento.lancamentoRelacionado " +
            "where fa.fechamento = :fechamento " +
            "and fa.ano = :ano " +
            "order by lancamento.dataCompra desc")
    FastList<FaturaItem> findAllByFechamentoAndAno(@Param("fechamento") Long fechamento,
                                                   @Param("ano") Integer ano);

    @Query(value = "select fa " +
            "from FaturaItem fa " +
            "left join fetch fa.parcela pa " +
            "left join fetch pa.mesReferencia " +
            "inner join fetch fa.lancamento lancamento " +
            "inner join fetch lancamento.pessoa pessoa " +
            "inner join fetch lancamento.formaPagamento formaPagamento " +
            "left join fetch formaPagamento.dono " +
            "inner join fetch lancamento.mes " +
            "left join fetch lancamento.lancamentoRelacionado " +
            "left join fetch lancamento.lancamentos " +
            "where fa.fechamento = :fechamento " +
            "and fa.ano = :ano " +
            "and lancamento.lancamentoRelacionado is null " +
            "and ((lancamento.pago <> true) or (lancamento.parcelado = true and pa.pago <> true)) " +
            "and (:searchKey = '' or lower(lancamento.nome) like lower(concat('%', :searchKey, '%')) or lower(pessoa.nome) like lower(concat('%', :searchKey, '%')) or lower(formaPagamento.nome) like lower(concat('%', :searchKey, '%')) ) ",
            countQuery = "select count(fi) " +
                    "from FaturaItem fi " +
                    "inner join fi.lancamento lancamento " +
                    "left join fi.parcela pa " +
                    "left join lancamento.pessoa pessoa " +
                    "where fi.fechamento = :fechamento " +
                    "and fi.ano = :ano " +
                    "and lancamento.lancamentoRelacionado is null " +
                    "and ((lancamento.pago <> true) or (lancamento.parcelado = true and pa.pago <> true)) " +
                    "and (:searchKey = '' or lower(lancamento.nome) like lower(concat('%', :searchKey, '%')) or lower(pessoa.nome) like lower(concat('%', :searchKey, '%')) or lower(lancamento.formaPagamento.nome) like lower(concat('%', :searchKey, '%')) ) "
    )
    Page<FaturaItem> findAllByFechamentoAndAnoAndNotPago(@Param("fechamento") Long fechamento,
                                                         @Param("ano") Integer ano,
                                                         Pageable pageable,
                                                         @Param("searchKey") String searchKey);

    @Query(value = "select fa " +
            "from FaturaItem fa " +
            "inner join fetch fa.lancamento lancamento " +
            "inner join fetch lancamento.pessoa pessoa " +
            "inner join fetch lancamento.formaPagamento formaPagamento " +
            "left join fetch formaPagamento.dono dono " +
            "inner join fetch lancamento.mes " +
            "left join fetch lancamento.lancamentos lancamentos " +
            "left join fetch lancamentos.pessoa pessoaLancamentos " +
            "left join fetch fa.parcela parcela " +
            "left join fetch parcela.mesReferencia " +
            "where fa.fechamento = :fechamento " +
            "and fa.lancamento.lancamentoRelacionado is null " +
            "and fa.ano = :ano " +
            "and (:searchKey = '' or lower(lancamento.nome) like lower(concat('%', :searchKey, '%')) or lower(pessoa.nome) like lower(concat('%', :searchKey, '%')) or lower(formaPagamento.nome) like lower(concat('%', :searchKey, '%')) ) " +
            "order by fa.lancamento.dataCompra desc",
            countQuery = "select count(fi) " +
                    "from FaturaItem fi " +
                    "inner join fi.lancamento lancamento " +
                    "inner join lancamento.pessoa pessoa " +
                    "left join fi.parcela pa " +
                    "where fi.fechamento = :fechamento " +
                    "and fi.ano = :ano " +
                    "and (:searchKey = '' or lower(lancamento.nome) like lower(concat('%', :searchKey, '%')) or lower(pessoa.nome) like lower(concat('%', :searchKey, '%')) or lower(lancamento.formaPagamento.nome) like lower(concat('%', :searchKey, '%')) ) " +
                    "and lancamento.lancamentoRelacionado is null"
    )
    Page<FaturaItem> findAllByFechamentoAndAno(@Param("fechamento") Long fechamento,
                                               @Param("ano") Integer ano,
                                               Pageable pageable,
                                               @Param("searchKey") String searchKey);

    @Query(value = "select fa " +
            "from FaturaItem fa " +
            "left join fetch fa.parcela pa " +
            "left join fetch pa.mesReferencia " +
            "inner join fetch fa.lancamento lancamento " +
            "inner join fetch lancamento.pessoa pessoa " +
            "inner join fetch lancamento.mes " +
            "inner join fetch lancamento.formaPagamento formaPagamento " +
            "left join fetch formaPagamento.dono " +
            "left join fetch lancamento.lancamentoRelacionado " +
            "left join fetch lancamento.lancamentos " +
            "where fa.fechamento = :fechamento " +
            "and fa.ano = :ano " +
            "and pessoa = :pessoa " +
            "and (lancamento.pago <> true or lancamento.parcelado = true and pa.pago <> true) " +
            "and (:searchKey = '' or lower(lancamento.nome) like lower(concat('%', :searchKey, '%')) or lower(pessoa.nome) like lower(concat('%', :searchKey, '%')) or lower(formaPagamento.nome) like lower(concat('%', :searchKey, '%')) ) ",
            countQuery = "select count(fi) " +
                    "from FaturaItem fi " +
                    "inner join fi.lancamento lancamento " +
                    "where fi.fechamento = :fechamento " +
                    "and fi.ano = :ano " +
                    "and fi.lancamento.pessoa = :pessoa " +
                    "and (:searchKey = '' or lower(lancamento.nome) like lower(concat('%', :searchKey, '%')) or lower(lancamento.pessoa.nome) like lower(concat('%', :searchKey, '%')) or lower(lancamento.formaPagamento.nome) like lower(concat('%', :searchKey, '%')) ) " +
                    "and (fi.lancamento.pago <> true or fi.lancamento.parcelado = true and fi.parcela.pago <> true) ")
    Page<FaturaItem> findAllByFechamentoAndAnoAndPessoaAndNotPago(@Param("fechamento") Long fechamento,
                                                                  @Param("ano") Integer ano,
                                                                  @Param("pessoa") Pessoa pessoa,
                                                                  Pageable pageRequest,
                                                                  @Param("searchKey") String searchKey);

    @Query(value = "select fa " +
            "from FaturaItem fa " +
            "left join fetch fa.parcela pa " +
            "left join fetch pa.mesReferencia " +
            "inner join fetch fa.lancamento lancamento " +
            "inner join fetch lancamento.pessoa pessoa " +
            "inner join fetch lancamento.mes " +
            "inner join fetch lancamento.formaPagamento formaPagamento " +
            "left join fetch formaPagamento.dono " +
            "left join fetch lancamento.lancamentoRelacionado lancamentoRelacionado " +
            "left join fetch lancamento.lancamentos lancamentos " +
            "left join fetch lancamentos.pessoa lancamentosPessoas " +
            "where fa.fechamento = :fechamento " +
            "and fa.ano = :ano " +
            "and pessoa = :pessoa " +
            "and (:searchKey = '' or lower(lancamento.nome) like lower(concat('%', :searchKey, '%')) or lower(pessoa.nome) like lower(concat('%', :searchKey, '%')) or lower(formaPagamento.nome) like lower(concat('%', :searchKey, '%')) ) "
            ,
            countQuery = "select count(fi) " +
                    "from FaturaItem fi " +
                    "inner join fi.lancamento lancamento " +
                    "where fi.fechamento = :fechamento " +
                    "and fi.ano = :ano " +
                    "and fi.lancamento.pessoa = :pessoa " +
                    "and (:searchKey = '' or lower(lancamento.nome) like lower(concat('%', :searchKey, '%')) or lower(fi.lancamento.pessoa.nome) like lower(concat('%', :searchKey, '%')) or lower(lancamento.formaPagamento.nome) like lower(concat('%', :searchKey, '%')) ) "
    )
    Page<FaturaItem> findAllByFechamentoAndAnoAndPessoa(@Param("fechamento") Long fechamento,
                                                        @Param("ano") Integer ano,
                                                        @Param("pessoa") Pessoa pessoa,
                                                        Pageable pageRequest,
                                                        @Param("searchKey") String searchKey);

    @Query("select fa " +
            "from FaturaItem fa " +
            "left join fetch fa.parcela pa " +
            "inner join fetch fa.lancamento lancamento " +
            "inner join fetch lancamento.pessoa pessoa " +
            "inner join fetch lancamento.mes " +
            "inner join fetch lancamento.formaPagamento formaPagamento " +
            "left join fetch lancamento.lancamentoRelacionado " +
//            "left join fetch lancamento.lancamentos " +
            "where fa.fechamento = :fechamento " +
            "and fa.ano = :ano " +
            "and pessoa = :pessoa " +
            "and (lancamento.pago <> true or lancamento.parcelado = true and pa.pago <> true)")
    FastList<FaturaItem> findAllByFechamentoAndAnoAndPessoaAtual(@Param("fechamento") Long fechamento,
                                                                 @Param("ano") Integer ano,
                                                                 @Param("pessoa") Pessoa pessoa);

    @Query(value = " select fi " +
            "from FaturaItem  fi " +
            "inner join fetch fi.lancamento lancamento " +
            "left join fetch fi.parcela parcela " +
            "left join fetch parcela.mesReferencia " +
            "left join fetch lancamento.lancamentoRelacionado " +
            "left join fetch lancamento.lancamentos " +
            "inner join fetch lancamento.pessoa pessoa " +
            "inner join fetch lancamento.mes " +
            "inner join fetch lancamento.formaPagamento formaPagamento " +
            "where fi.fechamento = :fechamento " +
            "and fi.ano = :ano " +
            " and lancamento.lancamentoRelacionado is null " +

            "and ((UPPER(lancamento.nome) LIKE :lancamentoNome or UPPER(formaPagamento.nome) LIKE :cartaoNome or UPPER(fi.lancamento.pessoa.nome) like :pessoaNome)  or " +
            "(UPPER(lancamento.nome) LIKE :lancamentoNome or UPPER(formaPagamento.nome) LIKE :cartaoNome or UPPER(fi.lancamento.pessoa.nome) like :pessoaNome))",
            countQuery = "select count(fi) " +
                    "from FaturaItem fi " +
                    "inner join fi.lancamento lancamento " +
                    "inner join lancamento.formaPagamento formaPagamento " +
                    "where fi.fechamento = :fechamento " +
                    " and fi.ano  = :ano " +
                    "and lancamento.lancamentoRelacionado is null " +
                    "and ((UPPER(lancamento.nome) LIKE :lancamentoNome or UPPER(formaPagamento.nome) LIKE :cartaoNome or UPPER(fi.lancamento.pessoa.nome) like :pessoaNome)  or " +
                    "(UPPER(lancamento.nome) LIKE :lancamentoNome or UPPER(formaPagamento.nome) LIKE :cartaoNome or UPPER(lancamento.pessoa.nome) like :pessoaNome) )"
    )
    Page<FaturaItem> search(
            @Param("fechamento") Long fechamento,
            @Param("ano") Integer ano,
            @Param("pessoaNome") String pessoaNome,
            @Param("lancamentoNome") String lancamentoNome,
            @Param("cartaoNome") String cartaoNome,
            Pageable pageable
    );

    @Query(value = " select distinct fi " +
            "from FaturaItem  fi " +
            "inner join fetch fi.lancamento lancamento " +
            "left join fetch fi.parcela parcela " +
            "left join fetch parcela.mesReferencia " +
            "inner join fetch lancamento.pessoa pessoa " +
            "inner join fetch lancamento.mes " +
            "inner join fetch lancamento.formaPagamento formaPagamento " +
            "where fi.fechamento = :fechamento " +
            "and fi.ano = :ano " +
            "and lancamento.pessoa = :pessoa " +
            "and lancamento.nome LIKE %:lancamentoNome% " +
            "or formaPagamento.nome LIKE %:cartaoNome%",
            countQuery = " select count(fi) " +
                    "from FaturaItem  fi " +
                    "where fi.fechamento = :fechamento " +
                    "and fi.ano = :ano " +
                    "and fi.lancamento.pessoa = :pessoa " +
                    "and UPPER(fi.lancamento.nome) LIKE %:lancamentoNome% " +
                    "or UPPER(fi.lancamento.formaPagamento.nome) LIKE %:cartaoNome% "
    )
    Page<FaturaItem> findAllByFechamentoAndAnoAndLancamentoPessoaAndLancamentoNomeOrFormaPagamentoNome(
            @Param("fechamento") Long fechamento,
            @Param("ano") Integer ano,
            @Param("pessoa") Pessoa pessoa,
            @Param("lancamentoNome") String lancamentoNome,
            @Param("cartaoNome") String cartaoNome, Pageable page
    );

    @EntityGraph(attributePaths = {"parcela", "lancamento", "lancamento.mes", "lancamento.lancamentoRelacionado", "lancamento.lancamentos",
            "lancamento.pessoa", "lancamento.formaPagamento", "parcela.mesReferencia", "lancamento.formaPagamento.dono"})
    FaturaItem findByFechamentoAndAnoAndLancamentoId(Long fechamento, Integer ano, Long lancamentoId);
}
