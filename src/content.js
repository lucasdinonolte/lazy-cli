import { basename, join } from 'path';
import { readdirSync } from 'fs';
import { loadConfig } from 'unconfig';

import glob from 'glob';

import { __dirname } from './paths.js';

import {
  CONFIG_FILE_NAME,
  SNIPPETS_PATH,
  TEMPLATE_FILE_PREFIX,
} from './constants.js';

const DEFAULT_SNIPPETS_DIR = join(__dirname, '..', SNIPPETS_PATH);

export const readSnippetConfig = async (path) => {
  try {
    const { config } = await loadConfig({
      sources: [
        {
          files: CONFIG_FILE_NAME,
          extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs'],
        },
      ],
      cwd: path,
      merge: false,
    });

    return config || false;
  } catch (e) {
    return false;
  }
};

export const readSnippetFiles = (path) => {
  const files = glob.sync(join(path, '**/*'), { nodir: true, dot: true });
  return files
    .map((file) => basename(file))
    .filter((file) => !file.startsWith(CONFIG_FILE_NAME))
    .filter((file) => !file.startsWith(TEMPLATE_FILE_PREFIX));
};

export const loadCustomAndBuiltInSnippets = async (customSnippetsDir) => {
  return await loadSnippets(customSnippetsDir);
};

export const loadSnippets = async (contentDir = DEFAULT_SNIPPETS_DIR) => {
  const foldersInContent = readdirSync(contentDir, { withFileTypes: true });

  if (foldersInContent.length === 0) return [];

  const folders = foldersInContent.filter((dirent) => dirent.isDirectory());

  const snippets = [];

  for (const dirent of folders) {
    const snippet = {
      name: dirent.name,
      path: join(contentDir, dirent.name),
      config: await readSnippetConfig(join(contentDir, dirent.name)),
      files: readSnippetFiles(join(contentDir, dirent.name)),
    };
    snippets.push(snippet);
  }

  return snippets.filter((snippet) => snippet.config !== false);
};
