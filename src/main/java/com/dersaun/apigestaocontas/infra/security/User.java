package com.dersaun.apigestaocontas.infra.security;

import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.interfaces.UserCredentialDetails;
import com.dersaun.apigestaocontas.domain.services.UsuarioService;
import com.dersaun.apigestaocontas.infra.utils.DateUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class User implements Serializable, UserCredentialDetails {

    Long id;
    String conta;
    String senha;
    List<SimpleGrantedAuthority> roles;
    Pessoa pessoa;
    Integer situacao;

    public void setPessoa(Map pes) {

        var pessoa = new Pessoa();
        pessoa.setId(((Integer) pes.get("id")).longValue());
        pessoa.setNome((String) pes.get("nome"));
        pessoa.setSobrenome((String) pes.get("sobrenome"));
        pessoa.setApelido((String) pes.get("apelido"));
        pessoa.setPerfil((String) pes.get("perfil"));
        pessoa.setCreatedAt(getLocalDateTime((String) pes.get("createdAt")));
        pessoa.setUpdatedAt(getLocalDateTime((String) pes.get("updatedAt")));
        pessoa.setSexo((String) pes.get("sexo"));
        pessoa.setDataNascimento(getLocalDate((String) pes.get("dataNascimento")));

        this.pessoa = pessoa;
    }

    public void setRoles(List<Map<String, String>> roles) {

        if (!roles.isEmpty()) {
            this.roles = roles.stream()
                    .map( val -> new SimpleGrantedAuthority(val.get("authority")))
                    .collect(Collectors.toList());
        }
    }

    private LocalDate getLocalDate(String date) {
        return DateUtils.toLocalDate(date);
    }

    private LocalDateTime getLocalDateTime(String date) {
        Date data = getDate(date);

        if (data != null) {
            return Instant.ofEpochMilli(data.getTime())
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();
        }
        return null;
    }

    private Date getDate(String date) {
        return getDate(date, null);
    }

    private Date getDate(String date, String pattern) {
        return DateUtils.toDate(date, pattern);
    }

    public boolean hasAnyRole(String... params) {
        return UsuarioService.hasAnyRole(getRoles(), params);
    }

    public boolean hasRole(String role) {
        return UsuarioService.hasRole(getRoles(), role);
    }

    public boolean anyNotGranted(String... params) {
        return !hasAnyRole(params);
    }

    public boolean notGranted(String param) {
        return !hasRole(param);
    }

    public Boolean isAdmin() {
        return hasRole("ROLE_ADMIN");
    }
}
