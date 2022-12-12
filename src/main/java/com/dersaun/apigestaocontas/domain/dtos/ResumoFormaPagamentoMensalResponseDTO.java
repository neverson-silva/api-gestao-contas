package com.dersaun.apigestaocontas.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumoFormaPagamentoMensalResponseDTO implements Serializable {
    private ResumoFormaPagamentoMensalDTO cartao;
    private ResumoFormaPagamentoMensalDTO dinheiro;
    private ResumoFormaPagamentoMensalDTO parcelado;
    private ResumoFormaPagamentoMensalDTO total;

}
