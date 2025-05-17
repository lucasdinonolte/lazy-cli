import fg from 'fast-glob';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { PromptObject } from 'prompts';
import prompts from 'prompts';
import { loadConfig } from 'unconfig';

import { LAZY_CONFIG_FILE_GLOB, LAZY_CONFIG_FILE_NAME } from './constants';
import { Context } from './context';
import { StringUtils, stringUtils } from './formatters';
import { getMergerForPath } from './mergers';
import type { MergerType } from './mergers';
import { resolveSnippet } from './snippet';
import { ensureParentDirectoryExists, maybeReadFile } from './utils';

type FileAction = {
  merger?: MergerType;
  template: string;
  path: string;
};

// TODO: Maybe there's different types of
// actions in the future (like running commands)
type Action = FileAction;

export type SnippetConfig = {
  name: string;
  description?: string;
  dependencies?: Array<string>;
  prompts: Array<PromptObject<string>>;
  actions:
    | Array<Action>
    | ((
        data: prompts.Answers<string>,
        stringUtils: StringUtils,
      ) => Array<Action>);
};

export type ResolvedSnippet = SnippetConfig & {
  id: string;
};

const defaultConfig: SnippetConfig = {
  name: '',
  dependencies: [],
  prompts: [],
  actions: [],
};

const loadSnippetConfig = async ({ path }: { path: string }) => {
  const { config } = await loadConfig<SnippetConfig>({
    cwd: path,
    sources: [
      {
        files: LAZY_CONFIG_FILE_NAME,
      },
    ],
  });

  return { ...defaultConfig, ...config };
};

export const loadSnippets = async (snippetsPath: string, context: Context) => {
  const files = await fg(join(snippetsPath, LAZY_CONFIG_FILE_GLOB));
  const snippets = [];

  for (const file of files) {
    const dir = dirname(file);
    const config = await loadSnippetConfig({ path: file });
    if (!config) {
      context.logger.warn(`No config found for snippet from ${dir}`);
      continue;
    }

    const id = dir.split('/').pop();

    if (!id) {
      context.logger.warn(`Could not determine ID for snippet from ${dir}`);
      continue;
    }

    context.logger.debug(`Loaded snippet config for ${id}`);
    snippets.push(resolveSnippet(id, config));
  }

  return snippets;
};

export const resolveActions = (
  snippet: SnippetConfig,
  data: object,
): Array<Action> => {
  if (typeof snippet.actions === 'function') {
    const res = snippet.actions(data, stringUtils);
    return res.filter(Boolean);
  }

  return snippet.actions.filter(Boolean);
};

export const runActions = async (actions: Array<Action>, ctx: Context) => {
  for (const action of actions) {
    ctx.logger.debug(`Writing ${action.path}`);

    const merger = getMergerForPath(action.path, action.merger);
    ctx.logger.debug(`Using merger ${merger.name} for ${action.path}`);

    try {
      await ensureParentDirectoryExists(action.path);

      const targetFile = await maybeReadFile(action.path);
      const mergedFile = merger(targetFile, action.template);
      await writeFile(action.path, mergedFile);
      ctx.logger.success(`Wrote ${action.path}`);
    } catch {
      ctx.logger.error(`Failed to write ${action.path}`);
    }
  }
};
