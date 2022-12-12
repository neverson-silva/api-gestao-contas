package com.dersaun.apigestaocontas.api.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.collections.api.list.MutableList;
import org.eclipse.collections.impl.list.mutable.FastList;

import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DivisaoLancamentoDTO {
    protected boolean igualmente;
    protected boolean diferente;
    protected MutableList<PessoaDivisaoLancamentoDTO> pessoas = new FastList<>();

    public void setPessoas(Collection<PessoaDivisaoLancamentoDTO> pessoas) {
        this.pessoas = new FastList<>((Collection) pessoas);
    }
}
