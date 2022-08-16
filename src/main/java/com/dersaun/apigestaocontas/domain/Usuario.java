package com.dersaun.apigestaocontas.domain;

import com.dersaun.apigestaocontas.domain.interfaces.UserCredentialDetails;
import com.dersaun.apigestaocontas.domain.services.UsuarioService;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.*;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.impl.list.mutable.FastList;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@EqualsAndHashCode
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"regras"})
public class Usuario implements UserCredentialDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "email", length = 45, unique = true)
    private String conta;

    @Column(name = "password", length = 200)
    @JsonIgnore
    private String senha;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinColumn(name = "devedor_id")
    private Pessoa pessoa;

    private Boolean primeiroAcesso;
    /**
     * 1 Ativo
     * 2 Cancelado
     * 3 Bloqueado
     */
    private Integer situacao;

    @CreationTimestamp
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime updatedAt;

    @ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinTable(name = "usuario_regra",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "regra_id", referencedColumnName = "regra_id")}
    )
    List<Regra> regras = new FastList<>();

    @PrePersist
    void encrypt() {
        var encoder = new BCryptPasswordEncoder();
        var senha = encoder.encode(this.senha);
        this.senha = senha;
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

    public Boolean matchSenha(String senha) {
        var bc = new BCryptPasswordEncoder();

        return bc.matches(senha, this.senha);
    }

    @Override
    public Collection<? extends GrantedAuthority> getRoles() {
        return getRegras().collect(regra -> new SimpleGrantedAuthority(regra.getAuthority()));
    }

    public MutableList<Regra> getRegras() {
        if (!(regras instanceof MutableList)) {
            regras = FastList.newList(regras);
        }
        return (MutableList<Regra>) regras;
    }

}
