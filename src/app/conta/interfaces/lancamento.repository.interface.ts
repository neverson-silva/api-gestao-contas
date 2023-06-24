import {
  IRepository,
  ManagebleRepository,
} from 'src/infra/interfaces/repository';
import { Lancamento } from '../models/lancamento.entity';

export interface ILancamentoRepository
  extends IRepository<Lancamento>,
    ManagebleRepository {
  buscarCompleto(idLancamento: number): Promise<Lancamento>;

  deleteByLancamentoRelacionado(lancamento: Lancamento): Promise<void>;
}
