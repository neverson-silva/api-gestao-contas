import { isValidValue } from '@utils/index';

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const SIGLA_ESTADOS_ALGARISMOS_ROMANOS: string[] = [
  'i',
  'ii',
  'iii',
  'iv',
  'ix',
  'ltda',
  's/a',
  'sa',
  'v',
  'vi',
  'vii',
  'viii',
  'x',
  'ac',
  'al',
  'am',
  'ap',
  'ba',
  'ce',
  'df',
  'eg',
  'es',
  'go',
  'ma',
  'mg',
  'ms',
  'mt',
  'nc',
  'pa',
  'pb',
  'pi',
  'pr',
  'rj',
  'rn',
  'ro',
  'rr',
  'rs',
  's.a.',
  'sc',
  'se',
  'sp',
  'ti',
  't.i.',
  'to',
];

const PREPOSICOES: string[] = [
  'a',
  'ao',
  'aos',
  'as',
  'da',
  'das',
  'de',
  'do',
  'dos',
  'e',
  'em',
  'na',
  'nas',
  'no',
  'nos',
  'o',
  'os',
  'pela',
  'pelo',
  'por',
  'à',
];
const beautify = (value: string): string => {
  const text = value.toLowerCase();
  const words = text.split(' ').filter((word) => word.trim() !== '');
  const previous = { value: '' };
  let builder = '';

  words.forEach((word) => {
    const previousWord = previous.value;

    if (!isValidValue(previousWord)) {
      builder = builder.concat(capitalize(word));
    } else if (SIGLA_ESTADOS_ALGARISMOS_ROMANOS.includes(word)) {
      builder = builder.concat(word.toUpperCase());
    } else if (PREPOSICOES.includes(word) && !previousWord.includes('-')) {
      builder = builder.concat(word);
    } else {
      builder = builder.concat(capitalize(word));
    }

    previous.value = word;
    builder = builder.concat(' ');
  });

  return builder.trim().toString();
};

export const strings = {
  beautify,
  capitalize,
};
