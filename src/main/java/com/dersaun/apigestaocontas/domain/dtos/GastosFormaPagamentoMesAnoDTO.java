package com.dersaun.apigestaocontas.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eclipse.collections.api.list.MutableList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GastosFormaPagamentoMesAnoDTO extends MesAnoChartDTO{

    private MutableList<DadosGraficoGastoPorFormaPagamentoDTO> totaisFormaPagamento;

    public GastosFormaPagamentoMesAnoDTO(MesAnoChartDTO mesAnoChartDTO) {
        this.id = mesAnoChartDTO.id;
        this.nome = mesAnoChartDTO.nome;
        this.ano = mesAnoChartDTO.ano;
        this.fechamento = mesAnoChartDTO.fechamento;
        this.anoFechamento = mesAnoChartDTO.anoFechamento;
    }
}
