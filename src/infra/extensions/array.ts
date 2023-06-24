import { sortBy } from '@utils/index';

const extensions = () => {
  Array.prototype.groupBy = function <K, T>(keyGetter: any): Map<K, Array<T>> {
    const map = new Map<K, T[]>();

    this.forEach((item) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const key: K = keyGetter(item) as K;

      const collection: T[] = map.take(key);

      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });

    return map;
  };
  Array.prototype.sortBy = function (this: any[], item: any) {
    return sortBy(this, item);
  };
};

extensions();
