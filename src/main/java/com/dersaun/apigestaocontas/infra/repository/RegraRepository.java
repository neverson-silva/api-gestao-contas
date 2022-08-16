package com.dersaun.apigestaocontas.infra.repository;

import com.dersaun.apigestaocontas.domain.Regra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegraRepository extends JpaRepository<Regra, Long> {
    Regra findByAuthority(String authority);
}
