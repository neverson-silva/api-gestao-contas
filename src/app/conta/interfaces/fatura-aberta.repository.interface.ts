import { FaturaAberta } from '@app/conta/models/fatura-aberta.entity';
import { IRepository } from '@infra/interfaces/repository';

export interface IFaturaAbertaRepository extends IRepository<FaturaAberta> {
  getAll(): Promise<FaturaAberta[]>;
}
