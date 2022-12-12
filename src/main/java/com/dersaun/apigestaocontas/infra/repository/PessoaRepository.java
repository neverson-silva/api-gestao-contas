package com.dersaun.apigestaocontas.infra.repository;

import com.dersaun.apigestaocontas.domain.Pessoa;
import org.eclipse.collections.api.list.MutableList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

    MutableList<Pessoa> findAllByOrderByNomeAsc();
}
