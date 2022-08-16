package com.dersaun.apigestaocontas.infra.repository;

import com.dersaun.apigestaocontas.domain.RefreshToken;
import com.dersaun.apigestaocontas.domain.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    @Override
    @EntityGraph(attributePaths = {"usuario", "usuario.regras", "usuario.pessoa"})
    Optional<RefreshToken> findById(Long id);

    @EntityGraph(attributePaths = {"usuario", "usuario.regras", "usuario.pessoa"})
    Optional<RefreshToken> findByToken(String token);

    @EntityGraph(attributePaths = {"usuario"})
    Optional<RefreshToken> findByUsuarioId(Long usuarioId);

    int deleteByUsuario(Usuario usuario);

}
