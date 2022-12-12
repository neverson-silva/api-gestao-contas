package com.dersaun.apigestaocontas.domain.dtos;

import com.dersaun.apigestaocontas.infra.utils.MesUtils;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MesAnoChartDTO<T> implements Comparable<MesAnoChartDTO>{
    protected Long id;

    protected String nome;

    protected Integer ano;
    protected Long fechamento;
    protected Integer anoFechamento;

    @Override
    public int compareTo(@NotNull MesAnoChartDTO o) {
        if (id < o.getId() ){
            return -1;
        } else if (id.equals(o.getId())) {
            return 0;
        }
        return 1;
    }

    public MesAnoDTO toMesAno() {
        return MesUtils.getMesAno(this.fechamento, this.anoFechamento);
    }
}