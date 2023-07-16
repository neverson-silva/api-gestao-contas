import { Lancamento } from '@app/conta/models/lancamento.entity';
import { Parcela } from '@app/conta/models/parcela.entity';
import { IRepository, ManagebleRepository } from '@infra/interfaces/repository';

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
