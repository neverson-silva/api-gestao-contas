package com.dersaun.apigestaocontas.infra.repository;

import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    @EntityGraph(attributePaths = {"pessoa", "regras"})
    Optional<Usuario> findByConta(String conta);

    @EntityGraph(attributePaths = {"pessoa", "regras"})
    Optional<Usuario> findByPessoa(Pessoa pessoa);
}
