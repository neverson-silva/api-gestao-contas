import { IFaturaAbertaRepository } from '@app/conta/interfaces/fatura-aberta.repository.interface';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { FaturaAberta } from '@app/conta/models/fatura-aberta.entity';

@Injectable()
export class FaturaAbertaRepository
  extends Repository<FaturaAberta>
  implements IFaturaAbertaRepository
{
  constructor(em: EntityManager) {
    super(FaturaAberta, em);
  }

  async getAll(): Promise<FaturaAberta[]> {
    return await this.find({
      order: {
        lancamento: {
          dataCompra: 'DESC',
        },
      },
      join: {
        alias: 'fa',
        innerJoinAndSelect: {
          pessoa: 'fa.pessoa',
          lancamento: 'fa.lancamento',
        },
        leftJoinAndSelect: {
          parcela: 'fa.parcela',
        },
      },
    });
  }
}
