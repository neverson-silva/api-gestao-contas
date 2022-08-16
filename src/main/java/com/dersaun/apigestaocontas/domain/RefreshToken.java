package com.dersaun.apigestaocontas.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;

@Entity(name = "refresh_token")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RefreshToken {

    @Id()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne()
    @JoinColumn(name = "user_id")
    private Usuario usuario;

    @Column(nullable = false)
    private Instant expiryDate;
}