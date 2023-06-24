import { isValidValue } from '@utils/index';

const round = (value: string | number): number => {
  return Number(Number(value).toFixed(2));
};
const somar = (values: number[]) => {
  if (!isValidValue(values)) {
    return 0;
  }
  return values.reduce((total, value) => round(total + value), 0);
};

export const numberUtils = {
  round,
  somar,
};
