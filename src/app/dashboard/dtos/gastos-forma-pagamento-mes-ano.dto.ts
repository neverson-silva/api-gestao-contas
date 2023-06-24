import { MesAnoChartDTO } from '@app/conta/dtos/mes-ano-chart.dto';
import { DadosGraficoGastoPorFormaPagamentoDTO } from './dados-grafico-gasto-por-forma-pagamento.dto';

export class GastosFormaPagamentoMesAnoDTO extends MesAnoChartDTO {
  totaisFormaPagamento: DadosGraficoGastoPorFormaPagamentoDTO[];

  constructor(mesAnoChartDTO?: MesAnoChartDTO) {
    super(mesAnoChartDTO);
    this.totaisFormaPagamento = [];
  }
}
