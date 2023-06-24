import { ValueTransformer } from 'typeorm';

export class NumericTransformer implements ValueTransformer {
  to(data?: number | null): number | null {
    if (data == null) {
      return null;
    }
    return data;
  }

  from(data?: string | null): number | null {
    if (data != null && data != undefined && typeof data === 'string') {
      const res = data.includes('.') ? parseFloat(data) : parseInt(data);
      if (isNaN(res)) {
        return null;
      } else {
        return res;
      }
    }
    return data as unknown as number;
  }
}
