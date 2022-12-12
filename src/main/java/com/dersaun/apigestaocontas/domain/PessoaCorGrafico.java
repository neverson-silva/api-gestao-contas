package com.dersaun.apigestaocontas.domain;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
@Entity
@Table(name = "pessoas_cores_graficos")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PessoaCorGrafico {

    @Id
    @GeneratedValue
    private Long id;

    private String border;

    private String background;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pessoa_id")
    private Pessoa pessoa;
}