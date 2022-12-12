package com.dersaun.apigestaocontas.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DadosGraficoGastoPorFormaPagamentoDTO implements Serializable {
    private String corFormaPagamento;
    private String nomeFormaPagamento;
    private BigDecimal valorTotal;
}
