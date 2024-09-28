import { readFileSync } from 'node:fs';
import slugify from 'slugify';
import filenamify from 'filenamify';

export const maybeReadFile = (path) => {
  try {
    const file = readFileSync(path, 'utf8');
    return file;
  } catch (e) {
    return '';
  }
};

export const camelCase = (str) => {
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

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const pascalCase = (str) => capitalize(camelCase(str));
export const toSlug = (str) => slugify(str, { lower: true, strict: true });
export const toFilename = (str) => filenamify(str, { replacement: '_' });
