import { join } from 'path';
import { readdirSync, existsSync, readFileSync } from 'fs';

import glob from 'glob';

import { __dirname } from './paths.js';

import {
  CONFIG_FILE_NAME,
  SNIPPETS_PATH,
  TEMPLATE_FILE_EXTENSION,
} from './constants.js';

const DEFAULT_SNIPPETS_DIR = join(__dirname, '..', SNIPPETS_PATH);

export const readSnippetConfig = (path, configFile = CONFIG_FILE_NAME) => {
  const configPath = join(path, configFile);

  if (!existsSync(configPath)) return {};
  const config = readFileSync(configPath, 'utf8');

  return JSON.parse(config);
};

export const readSnippetFiles = (path, configFile = CONFIG_FILE_NAME) => {
  const files = glob.sync(join(path, '**/*'), { nodir: true, dot: true });
  return files
    .map((file) => file.replace(path, ''))
    .filter((file) => !file.endsWith(configFile))
    .filter((file) => !file.endsWith(TEMPLATE_FILE_EXTENSION));
};

export const loadCustomAndBuiltInSnippets = (customSnippetsDir) => {
  return [
    ...loadSnippets(customSnippetsDir),
    ...loadSnippets(DEFAULT_SNIPPETS_DIR),
  ];
};

export const loadSnippets = (contentDir = DEFAULT_SNIPPETS_DIR) => {
  const foldersInContent = readdirSync(contentDir, { withFileTypes: true });

  if (foldersInContent.length === 0) return [];

  const folders = foldersInContent
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => ({
      name: dirent.name,
      path: join(contentDir, dirent.name),
      config: Object.assign(
        {
          name: dirent.name,
        },
        readSnippetConfig(join(contentDir, dirent.name)),
      ),
      files: readSnippetFiles(join(contentDir, dirent.name)),
    }));

  return folders;
};
