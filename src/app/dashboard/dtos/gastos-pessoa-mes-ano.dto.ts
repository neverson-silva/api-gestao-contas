import { MesAnoChartDTO } from '@app/conta/dtos/mes-ano-chart.dto';
import { TotalPessoaMesAnoDTO } from '@app/dashboard/dtos/total-pessoa-mes-ano.dto';

export class GastosPessoaMesAnoDTO extends MesAnoChartDTO {
  totaisPessoa: TotalPessoaMesAnoDTO[];

  constructor(mesAnoChartDTO?: MesAnoChartDTO) {
    super(mesAnoChartDTO);
    this.totaisPessoa = [];
  }
}
