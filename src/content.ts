import fg from 'fast-glob';
import { writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { loadConfig } from 'unconfig';

import { LAZY_CONFIG_FILE_GLOB, LAZY_CONFIG_FILE_NAME } from './constants';
import type { Context } from './context';
import type { ProjectContext } from './environment';
import { stringUtils } from './formatters';
import { getMergerForPath } from './mergers';
import { resolveSnippet } from './snippet';
import type { Action, SnippetConfig } from './types';
import { ensureParentDirectoryExists, maybeReadFile } from './utils';

const defaultConfig: SnippetConfig = {
  name: '',
  dependencies: [],
  prompts: [],
  actions: [],
};

const loadSnippetConfig = async ({ path }: { path: string }) => {
  const { config } = await loadConfig<SnippetConfig>({
    cwd: dirname(path),
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

    const id = basename(dir);

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
  context: {
    data: object;
    snippetsPath: string;
    projectContext: ProjectContext;
  },
): Array<Action> => {
  if (typeof snippet.actions === 'function') {
    const res = snippet.actions(context, stringUtils);
    return res.filter(Boolean);
  }

  return snippet.actions.filter(Boolean);
};

export const resolvePrompts = (
  snippet: SnippetConfig,
  projectContext: ProjectContext,
) => {
  if (typeof snippet.prompts === 'function') {
    return snippet.prompts(projectContext);
  }

  return snippet.prompts;
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
    } catch (err) {
      ctx.logger.error(`Failed to write ${action.path}`);
      ctx.logger.debug((err as Error).message);
    }
  }
};
