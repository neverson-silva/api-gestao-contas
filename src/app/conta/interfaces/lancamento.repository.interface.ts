import { Lancamento } from '@app/conta/models/lancamento.entity';
import { IRepository, ManagebleRepository } from '@infra/interfaces/repository';

export interface ILancamentoRepository
  extends IRepository<Lancamento>,
    ManagebleRepository {
  buscarCompleto(idLancamento: number): Promise<Lancamento>;

  deleteByLancamentoRelacionado(lancamento: Lancamento): Promise<void>;
}
