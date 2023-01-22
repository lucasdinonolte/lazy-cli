import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { homedir } from 'os';

// Get the cjs equivalent of __dirname
// eslint-disable-next-line
export const __dirname = dirname(fileURLToPath(import.meta.url));

export const getSnippetDir = (snippetsPath) => {
  const USER_SNIPPETS_DIR = join(homedir(), `.lazy-cli/snippets`);

  if (snippetsPath && existsSync(snippetsPath)) {
    return snippetsPath;
  }

  if (existsSync(USER_SNIPPETS_DIR)) {
    return USER_SNIPPETS_DIR;
  }

  return null;
};
