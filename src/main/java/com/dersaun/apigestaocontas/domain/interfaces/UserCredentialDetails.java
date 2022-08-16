package com.dersaun.apigestaocontas.domain.interfaces;

import com.dersaun.apigestaocontas.domain.Pessoa;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public interface UserCredentialDetails {

    Long getId();

    String getSenha();

    String getConta();

    Integer getSituacao();

    Pessoa getPessoa();

    Collection<? extends GrantedAuthority> getRoles();

    boolean hasAnyRole(String... params);

    boolean hasRole(String role);

    boolean anyNotGranted(String... params);

    boolean notGranted(String param);

    Boolean isAdmin();
}
