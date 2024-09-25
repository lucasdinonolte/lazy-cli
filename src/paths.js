import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

import { USER_SNIPPETS_DIR } from './constants.js';

// Get the cjs equivalent of __dirname
// eslint-disable-next-line
export const __dirname = dirname(fileURLToPath(import.meta.url));

export const getSnippetDir = (snippetsPath) => {
  if (snippetsPath && existsSync(snippetsPath)) {
    return snippetsPath;
  }

  if (existsSync(USER_SNIPPETS_DIR)) {
    return USER_SNIPPETS_DIR;
  }

  return null;
};
