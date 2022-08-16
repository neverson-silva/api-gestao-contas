package com.dersaun.apigestaocontas.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "regras")
@Data
@NoArgsConstructor
public class Regra {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "regra_id")
    private Long id;

    private String authority;

    public Regra(Long id, String authority) {
        this.id = id;
        this.authority = authority;
    }
}
