package com.dersaun.apigestaocontas.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumoFormaPagamentoMensalDTO {

    private String titulo;

    private BigDecimal valor;

    private Double porcentagem;

    private String corIcone;
}
