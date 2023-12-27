import { Page } from './dtos/page.dto';
import { AppPaginationDTO } from '@utils/dtos/pagination.dto';
import {
  IPagination,
  IPaginationOptions,
} from '@extensions/database/interfaces';

export const isValidValue = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  if (Array.isArray(value) && value.length === 0) {
    return false;
  }

  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return false;
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return false;
  }

  if (
    Number.isNaN(value) ||
    (typeof value === 'number' && !Number.isFinite(value))
  ) {
    return false;
  }

  return true;
};

export function buildPagination<T>(
  options: IPaginationOptions,
  [items, totalItems]: [T[], number],
): IPagination<T> {
  return {
    items,
    meta: {
      itemCount: items.length,
      totalItems,
      itemsPerPage: Number(options.limit),
      totalPages: Math.ceil(totalItems / Number(options.limit)),
      currentPage: Number(options.page),
    },
  };
}
export function convertPagination<T>(itemsPaginated: IPagination<T>): Page<T> {
  const { meta } = itemsPaginated;
  const first = meta.currentPage === 1 || meta.currentPage === 0;
  const last =
    meta.currentPage === meta.totalPages ||
    meta.currentPage === meta.totalPages - 1;

  return {
    pageable: {
      pageSize: meta.itemsPerPage,
      pageNumber: meta.currentPage,
      paged: true,
      offset: 0,
      unpaged: false,
    },
    totalPages: meta.totalPages,
    totalElements: meta.totalItems,
    first,
    last,
    numberOfElements: meta.totalItems,
    size: meta.itemsPerPage,
    number: meta.currentPage,
    empty: meta.totalItems === 0 || meta.itemCount === 0,
    content: itemsPaginated.items as T[],
  };
}

export const converterString = (value: any) => {
  if (typeof value === 'object' && value.hasOwnProperty('toString')) {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.join('. ');
  }
  return JSON.stringify(value);
};

export function sortBy(items: any[], key: any): any[] {
  return items.sort((a, b) => {
    const isFunction = typeof key === 'function';
    const aValue = isFunction ? key(a) : dotNotedValue(a, key);
    const bValue = isFunction ? key(b) : dotNotedValue(b, key);

    if (aValue < bValue) {
      return -1;
    }
    if (aValue > bValue) {
      return 1;
    }
    return 0;
  });
}

export const dotNotedValue = (t: Record<any, any>, path) => {
  return path.split('.').reduce((r, k) => r?.[k], t);
};

export function createPaginationOptions<T>(pageRequest: AppPaginationDTO): {
  pageOptions: IPaginationOptions;
  sortOptions?: {
    column: keyof T | string;
    order: 'ASC' | 'DESC';
  };
} {
  const pageOptions = {
    page: pageRequest.page,
    limit: pageRequest.linesPerPage,
    countQueries: true,
  };

  const sortOptions = {
    column: pageRequest.orderBy,
    order: pageRequest.direction,
  } as any;
  return { pageOptions, sortOptions };
}

/*
 * validar se um valor é valido do contrário retorno o default
 * */
export const orElse = (value: any, defaultValue: any) =>
  isValidValue(value) ? value : defaultValue;
