package com.dersaun.apigestaocontas.domain.dtos;

import com.dersaun.apigestaocontas.domain.Pessoa;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TotalPessoaMesAnoDTO implements Serializable {


    private Long idPessoa;
    private String nome;
    private String sobrenome;
    private BigDecimal total;

    private String corBackgroud;
    private String corBorder;

    public TotalPessoaMesAnoDTO(Pessoa pessoa, BigDecimal total) {
        this.idPessoa = pessoa.getId();
        this.nome = pessoa.getNome();
        this.sobrenome = pessoa.getSobrenome();
        this.total = total;
    }
}
