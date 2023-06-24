import { Lancamento } from '@app/conta/models/lancamento.entity';

export enum EDivisaoTipo {
  IGUALMENTE = 1,
  DIFERENTE,
}
export class DivisaoDTO {
  tipoDivisao: EDivisaoTipo;
  valorLancamentoOriginal: number;
  lancamentos: Lancamento[] = [];
}
