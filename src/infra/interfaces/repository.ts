import { Page } from '@utils/dtos/page.dto';
import {
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { IPaginationOptions } from '@extensions/database/interfaces';

export declare interface IRepository<Entity extends ObjectLiteral>
  extends Repository<Entity> {
  paginate(
    options: IPaginationOptions,
    searchOptions?: FindOptionsWhere<Entity> | FindManyOptions<Entity>,
  ): Promise<Page<Entity>>;
}

export declare interface ManagebleRepository {
  storeCurrentManager();
  restoreCurrentManager();
  setEntityManager(em: EntityManager): EntityManager;
  getEntityManager(): EntityManager;
}
