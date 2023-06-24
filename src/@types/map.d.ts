interface Map<K, V> {
  toArray(): Array<V>;
  take(key: K): V | undefined;
  contains(key: K): boolean;
  putIfAbsent(key: K, value: V): void;
  orderBy(compareFn?: (a: [K, V], b: [K, V]) => number): Map<K, V>;
  map<U>(
    callbackfn: (value: [K, V], index: number, array: V[]) => U,
    thisArg?: any,
  ): U[];
  collect<U>(
    callbackfn: (key: K, value: V, index: number, array: V[]) => U,
    thisArg?: any,
  ): U[];
}
