package com.dersaun.apigestaocontas.infra.repository;

import com.dersaun.apigestaocontas.domain.Mes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MesRepository extends JpaRepository<Mes, Long> {

    @Query("""
        from Mes
        where atual = true""")
    Mes buscarMesAtual();
}
