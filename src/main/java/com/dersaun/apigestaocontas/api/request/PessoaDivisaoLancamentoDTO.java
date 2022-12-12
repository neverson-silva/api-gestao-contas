package com.dersaun.apigestaocontas.api.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PessoaDivisaoLancamentoDTO implements Serializable {
    private Long id;
    private BigDecimal valor;
}
