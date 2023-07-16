import { Parcelamento } from '@app/conta/dtos/parcelamento';
import { FaturaAberta } from '@app/conta/models/fatura-aberta.entity';
import { Lancamento } from '@app/conta/models/lancamento.entity';
import { Mes } from '@app/conta/models/mes.entity';
import { Parcela } from '@app/conta/models/parcela.entity';
import { ManagebleRepository } from '@infra/interfaces/repository';

export interface IParcelaService extends ManagebleRepository {
  parcelar(parcelamentos: Parcelamento[]): void;
  parcelar(parcelamento: Parcelamento): void;
  reparcelar(
    lancamento: Lancamento,
    quantidadeParcelasOriginal: number,
    mesAtual: Mes,
  ): Promise<void>;
  setParcelaAtual(parcela: Parcela): boolean;
  atualizar(
    lancamento: Lancamento,
    eraParcelado: boolean,
    atualmenteParceladoOrParcelado: boolean,
    quantidadeParcelasOriginal: number,
    mesAtual?: Mes,
  ): Promise<void>;
  atualizarEstado(lancamento: FaturaAberta): Promise<void>;
}
