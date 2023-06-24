import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ITotalPessoaRepository } from '../interfaces/total-pessoa.repository.interface';
import { TotalPessoa } from '../models/total-pessoa.entity';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';

@Injectable()
export class TotalPessoaRepository
  extends Repository<TotalPessoa>
  implements ITotalPessoaRepository
{
  _cachedManager: EntityManager;

  constructor(em: EntityManager) {
    super(TotalPessoa, em);
  }

  async findAllByMesAno(mesAno: MesAnoDTO): Promise<TotalPessoa[]> {
    const query = this.createQueryBuilder('totalpessoa')
      .innerJoinAndSelect('totalpessoa.pessoa', 'pessoa')
      .innerJoinAndSelect('totalpessoa.mes', 'mes')
      .where('totalpessoa.ano = :ano', { ano: mesAno.anoReferencia })
      .andWhere('totalpessoa.mes.id = :mesId', { mesId: mesAno.mesReferencia })
      .orderBy('pessoa.nome', 'ASC');
    const resultado = await query.getMany();
    return resultado;
  }

  getEntityManager(): EntityManager {
    return this.manager;
  }

  restoreCurrentManager() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this['manager'] = this._cachedManager;
  }

  setEntityManager(em: EntityManager): EntityManager {
    this.storeCurrentManager();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this['manager'] = this._cachedManager;
    return em;
  }

  storeCurrentManager() {
    this._cachedManager = this.manager;
  }
}
