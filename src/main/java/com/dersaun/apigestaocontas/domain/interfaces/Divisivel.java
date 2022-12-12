package com.dersaun.apigestaocontas.domain.interfaces;

import java.io.Serializable;
import java.math.BigDecimal;

public interface Divisivel extends Serializable {

    Boolean isPrincipal();

    Boolean isDividido();

    Divisivel getPrincipal();

    BigDecimal getValorUtilizado();

    Boolean hasLancamentosDivididos();

}