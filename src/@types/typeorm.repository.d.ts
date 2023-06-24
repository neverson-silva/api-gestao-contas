import { Page } from '@infra/utils/dtos';
import 'typeorm';
import { FindOptionsWhere } from 'typeorm';
import { IPaginationOptions } from '@extensions/database/interfaces';

declare module 'typeorm' {
  interface Repository<Entity> {
    paginate<Entity>(
      options: IPaginationOptions,
      searchOptions?: FindOptionsWhere<Entity> | FindManyOptions<Entity>,
    ): Promise<Page<Entity>>;
  }
}
