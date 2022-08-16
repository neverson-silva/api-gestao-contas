package com.dersaun.apigestaocontas.domain.services;

import com.dersaun.apigestaocontas.api.request.UserCreateRequest;
import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.Usuario;
import com.dersaun.apigestaocontas.domain.interfaces.UserCredentialDetails;
import com.dersaun.apigestaocontas.infra.exception.HttpException;
import com.dersaun.apigestaocontas.infra.security.AppUserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;

public interface UsuarioService {

    Optional<Usuario> findByPessoa(Pessoa pessoa);

    void salvar(UserCreateRequest user);

    static UserCredentialDetails usuario() {

        var userDetails = authenticated();

        return userDetails.getUsuario() ;
    }

    static AppUserDetails authenticated() {

        try {
            AppUserDetails userDetails = (AppUserDetails) SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getPrincipal();
            if (userDetails != null) {
                return userDetails;
            }
        } catch (Exception e) {
            System.out.println(e);
        }

        throw new HttpException("Acesso negado", "Usuário não autenticado ou sem permissão de acesso ao recurso", 401);
    }

    static boolean hasAnyRole(Collection<? extends GrantedAuthority> authorities, String... params) {
        return Arrays.stream(params)
                .anyMatch(param -> authorities.contains(new SimpleGrantedAuthority(param)));
    }

    static boolean hasRole(Collection<? extends GrantedAuthority> authorities, String role) {
        return authorities.contains(new SimpleGrantedAuthority(role));
    }
}
