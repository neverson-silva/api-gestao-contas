import * as deepEqual from 'deep-equal';

const extensions = () => {
  Map.prototype.toArray = function () {
    return Array.from(this.entries());
  };

  Map.prototype.take = function <K, V>(key: K): V | undefined {
    if (typeof key !== 'object') {
      return this.get(key);
    }

    for (const [entry, value] of this.toArray()) {
      if (deepEqual(key, entry)) {
        return value;
      }
    }
  };

  Map.prototype.contains = function <K>(key: K): boolean {
    if (typeof key !== 'object') {
      return this.has(key);
    }
    for (const [entry] of this.toArray()) {
      if (deepEqual(key, entry)) {
        return true;
      }
    }
    return false;
  };

  Map.prototype.putIfAbsent = function <K, V>(key: K, value: V): void {
    if (!this.contains(key)) {
      this.set(key, value);
    }
  };

  Map.prototype.orderBy = function <K, V>(
    compareFn?: (a: [K, V], b: [K, V]) => number,
  ): Map<K, V> {
    return new Map<K, V>([...this.entries()].sort(compareFn));
  };

  Map.prototype.map = function <K, V, U>(
    callbackfn: (value: [K, V], index: number, array: V[]) => U,
    thisArg?: any,
  ): Array<U> {
    return Array.from(this.entries()).map(callbackfn, thisArg);
  };

  Map.prototype.collect = function <K, V, U>(
    callbackfn: (key: K, value: V, index: number, array: V[]) => U,
    thisArg?: any,
  ): Array<U> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Array.from(this.entries()).map(callbackfn, thisArg);
  };
};

extensions();
