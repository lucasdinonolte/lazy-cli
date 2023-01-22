import { readFileSync } from 'node:fs';

export const maybeReadFile = (path) => {
  try {
    const file = readFileSync(path, 'utf8');
    return file;
  } catch (e) {
    return '';
  }
};
