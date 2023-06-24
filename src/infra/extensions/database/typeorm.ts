import { Page } from '@utils/dtos/page.dto';
import { buildPagination, convertPagination } from '@utils/index';

import {
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { IPaginationOptions } from '@extensions/database/interfaces';

const extensions = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  Repository.prototype.paginate = async function <T>(
    this: Repository<T>,
    options: IPaginationOptions,
    searchOptions?: FindOptionsWhere<any> | FindManyOptions<any>,
  ): Promise<any> {
    const skip = (Number(options.page ?? 1) - 1) * Number(options.limit ?? 10); // Calcula o número de registros a serem pulados
    const take = Number(options.limit ?? 10); // Define o número de registros a serem retornados

    const queryOptions = {
      ...searchOptions,
      skip,
      take,
      cache: options.cacheQueries,
    };

    const result: [T[], number] = await Promise.all([
      this.find(queryOptions as FindManyOptions<T>),
      this.count(queryOptions as FindManyOptions<T>),
    ]);
    const items = buildPagination<T>(options, result);
    return convertPagination<T>(items);
  };

  SelectQueryBuilder.prototype.paginate = async function <T>(
    this: SelectQueryBuilder<T>,
    options,
  ): Promise<Page<T>> {
    const skip = (Number(options.page ?? 1) - 1) * Number(options.limit ?? 10); // Calcula o número de registros a serem pulados
    const take = Number(options.limit ?? 10); // Define o número de registros a serem retornados

    const result = await (this as SelectQueryBuilder<any>)
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const items = buildPagination<T>(options, result);
    return convertPagination<T>(items);
  };

  SelectQueryBuilder.prototype.paginateRaw = async function <T>(
    this: SelectQueryBuilder<T>,
    options,
  ): Promise<Page<any>> {
    const skip = (Number(options.page ?? 1) - 1) * Number(options.limit ?? 10); // Calcula o número de registros a serem pulados
    const take = Number(options.limit ?? 10); // Define o número de registros a serem retornados

    const result: [any[], number] = await Promise.all([
      (this as SelectQueryBuilder<any>).skip(skip).take(take).getRawMany(),
      this.getCount(),
    ]);

    const items = buildPagination<T>(options, result);

    return convertPagination<T>(items);
  };
};

extensions();
