import { readFileSync } from 'node:fs';

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
  const upperCaseRegex = /([a-z]{2,})([A-Z])/g;

  return str
    .replace(upperCaseRegex, (_, a, b) => `${a}-${b}`)
    .split(' ')
    .map((word, idx) => {
      if (idx === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('-')
    .replace(camelRegex, (_, x) => x.toUpperCase());
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const pascalCase = (str) => capitalize(camelCase(str));
