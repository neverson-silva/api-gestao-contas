package com.dersaun.apigestaocontas.domain.dtos;

import com.dersaun.apigestaocontas.domain.Pessoa;
import com.dersaun.apigestaocontas.domain.ResumoFatura;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResumoFaturaPessoas implements Serializable {
    private Pessoa pessoa;
    private BigDecimal valorMesAtual;
    private BigDecimal valorMesAnterior;
    private List<ResumoFatura> resumos;
}
