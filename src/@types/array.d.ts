interface Array<T> {
  groupBy<K, T>(keyGetter: (item: T) => any): Map<K, Array<T>>;
  sortBy(key: string): T[];
  sortBy(keyGetter: (item: T) => keyof T | string): T[];
}
