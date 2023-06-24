import {
  IRepository,
  ManagebleRepository,
} from 'src/infra/interfaces/repository';
import { Parcela } from '../models/parcela.entity';
import { Lancamento } from '@app/conta/models/lancamento.entity';

export interface IParcelaRepository
  extends IRepository<Parcela>,
    ManagebleRepository {
  apagarTudoPorLancamento(lancamento: Lancamento): Promise<void>;
  apagarTudoRelacionadoPorLancamentoId(id: number): Promise<void>;
  pagarParcelasAnteriores(
    lancamento: Lancamento,
    numero: number,
    valor: number,
    dataAtualizacao: Date,
  ): Promise<void>;

  avancarParcela(
    lancamento: Lancamento,
    number: number,
    date: Date,
  ): Promise<void>;
  reabrirTodasParcelas(lancamento: Lancamento, date: Date): Promise<void>;

  desativarParcelasFuturasDefinirAtual(
    lancamento: Lancamento,
    numero: number,
    date: Date,
  ): Promise<void>;
}
