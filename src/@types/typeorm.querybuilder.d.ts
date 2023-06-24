import { Page } from '@infra/utils/dtos';
import 'typeorm';
import { IPaginationOptions } from '@extensions/database/interfaces';
import { ObjectLiteral } from 'typeorm';

declare module 'typeorm' {
  interface QueryBuilder<Entity extends ObjectLiteral> {
    paginate(options: IPaginationOptions): Promise<Page<Entity>>;

    paginateRaw(options: IPaginationOptions): Promise<Page<Entity>>;
  }
}
