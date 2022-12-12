package com.dersaun.apigestaocontas.domain.interfaces;

import com.dersaun.apigestaocontas.domain.FormaPagamento;
import com.dersaun.apigestaocontas.domain.Lancamento;
import com.dersaun.apigestaocontas.domain.Parcela;
import com.dersaun.apigestaocontas.domain.Pessoa;

import java.io.Serializable;
import java.math.BigDecimal;

public interface Faturavel extends Serializable {

    Lancamento getLancamento();

    Pessoa getPessoa();

    Parcela getParcela();

    FormaPagamento getFormaPagamento();

    BigDecimal getValorUtilizado();

    Boolean isParcelado();

    Boolean isDividido();

    Boolean isPrincipal();

    Divisivel getPrincipal();
}