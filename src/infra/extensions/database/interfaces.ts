export interface IPaginationOptions {
  limit: number | string;
  /**
   * @default 1
   * the page that is requested
   */
  page: number | string;

  /**
   * @default false
   * @link https://orkhan.gitbook.io/typeorm/docs/caching
   *
   * Enables or disables query result caching.
   */
  cacheQueries?: TypeORMCacheType;
}

export declare type TypeORMCacheType =
  | boolean
  | number
  | {
      id: any;
      milliseconds: number;
    };
export interface ObjectLiteral {
  [s: string]: any;
}

export interface IPaginationMeta extends ObjectLiteral {
  /**
   * the amount of items on this specific page
   */
  itemCount: number;
  /**
   * the total amount of items
   */
  totalItems?: number;
  /**
   * the amount of items that were requested per page
   */
  itemsPerPage: number;
  /**
   * the total amount of pages in this paginator
   */
  totalPages?: number;
  /**
   * the current page this paginator "points" to
   */
  currentPage: number;
}

export interface IPagination<T> {
  items: T[];
  meta: IPaginationMeta;
}
