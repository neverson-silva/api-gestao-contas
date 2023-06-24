import { mesUtil } from '@utils/meses';
import { MesAnoDTO } from './mes-ano.dto';

export class MesAnoChartDTO {
  id: number;
  nome: string;
  ano: number;
  fechamento: number;
  anoFechamento: number;

  constructor(obj?: Partial<MesAnoChartDTO>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
  public toMesAno(): MesAnoDTO {
    return mesUtil.getMesAno(this.fechamento, this.anoFechamento);
  }
}
