package com.dersaun.apigestaocontas.domain.dtos;

import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.interfaces.UserCredentialDetails;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;
import java.util.Collection;

@EqualsAndHashCode
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UsuarioResponse implements Serializable {

    private Long id;

    private String conta;

    private String senha;

    private Integer situacao;

    private Pessoa pessoa;

    private Collection<? extends GrantedAuthority> roles;

    private String accessToken;

    private String refreshToken;

    public UsuarioResponse(UserCredentialDetails usuario) {
        this.id = usuario.getId();
        this.conta = usuario.getConta();
        this.senha = usuario.getSenha();
        this.situacao = usuario.getSituacao();
        this.pessoa = usuario.getPessoa();
        this.roles = usuario.getRoles();
    }

    public UsuarioResponse(UserCredentialDetails usuario, String accessToken, String refreshToken) {
        this.id = usuario.getId();
        this.conta = usuario.getConta();
        this.senha = usuario.getSenha();
        this.situacao = usuario.getSituacao();
        this.pessoa = usuario.getPessoa();
        this.roles = usuario.getRoles();
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

}