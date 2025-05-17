import filenamify from 'filenamify';
import slugify from 'slugify';

export const camelCase = (str: string): string => {
  const camelRegex = /[_.-]+(\w|$)/g;
  const splitRegex = /[-_ ]+/;
  const upperCaseRegex = /(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g;

  return str
    .split(splitRegex)
    .map((word) => word.split(upperCaseRegex))
    .flat()
    .map((word, idx) => {
      if (idx === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('-')
    .replace(camelRegex, (_, x) => x.toUpperCase());
};

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
export const pascalCase = (str: string): string => capitalize(camelCase(str));
export const toSlug = (str: string): string =>
  slugify(str, { lower: true, strict: true });
export const toFilename = (str: string): string =>
  filenamify(str, { replacement: '_' });

export const stringUtils = {
  camelCase,
  capitalize,
  pascalCase,
  toSlug,
  toFilename,
} as const;

export type StringUtils = typeof stringUtils;
