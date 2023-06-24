import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { ResumoFatura } from '../models/resumo-fatura.entity';

export class ResumoFaturaPessoas {
  pessoa: Pessoa;
  valorMesAtual: number;
  valorMesAnterior: number;
  resumos: ResumoFatura[];

  constructor(dto?: Partial<ResumoFaturaPessoas>) {
    Object.assign(this, dto);
    this.resumos =
      this.resumos?.map((resumo) => new ResumoFatura(resumo)) ?? [];
  }
}
