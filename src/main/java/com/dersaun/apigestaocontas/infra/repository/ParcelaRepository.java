package com.dersaun.apigestaocontas.infra.repository;

import com.dersaun.apigestaocontas.domain.Lancamento;
import com.dersaun.apigestaocontas.domain.Parcela;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ParcelaRepository extends JpaRepository<Parcela, Long> {

    @Modifying()
    @Query("delete from Parcela where lancamento = ?1")
    void apagarTudoPorLancamento(Lancamento lancamento);

    @Modifying()
    @Query(value = """
    DELETE FROM parcelas 
                        WHERE parcelas.conta_id IN ( 
                            SELECT c.conta_id FROM ( 
                              SELECT DISTINCT cc.conta_id AS conta_id 
                              FROM contas cc 
                              INNER JOIN parcelas p ON p.conta_id = cc.conta_id 
                              where cc.conta_id_relacionado = ?1 
                        ) AS c)
    """, nativeQuery = true)
    void apagarTudoRelacionadoPorLancamentoId(Long id);
}
