package com.dersaun.apigestaocontas.domain.dtos;

import com.dersaun.apigestaocontas.domain.Lancamento;
import com.dersaun.apigestaocontas.domain.enums.EDivisaoTipo;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.impl.list.mutable.FastList;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class DivisaoDTO implements Serializable {

    private EDivisaoTipo tipoDivisao;

    private BigDecimal valorLancamentoOriginal;

    private MutableList<Lancamento> lancamentos;

    public DivisaoDTO() {
        this.lancamentos = new FastList<>();
    }
}
