import { IMesRepository } from '@app/conta/interfaces/mes.repository.interface';
import { Mes } from '@app/conta/models/mes.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class MesRepository extends Repository<Mes> implements IMesRepository {
  private _cachedManager: EntityManager;

  constructor(em: EntityManager) {
    super(Mes, em);
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
