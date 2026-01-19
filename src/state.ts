import { writeFile } from 'node:fs/promises';

import { LAZY_STATE_FILE } from './constants';
import { ensureParentDirectoryExists, maybeReadJSONFile } from './utils';

type GlobalState = {
  [key: string]: {
    installed: string[];
    installedAt: string;
  };
};

const readState = async () => {
  const state = await maybeReadJSONFile<GlobalState>(LAZY_STATE_FILE);
  return state || {};
};

const writeState = async (state: GlobalState) => {
  await ensureParentDirectoryExists(LAZY_STATE_FILE);
  await writeFile(LAZY_STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
};

export const markSnippetsAsInstalled = async (
  projectPath: string,
  snippetName: Array<string>,
) => {
  const state = await readState();
  if (!state[projectPath]) {
    state[projectPath] = {
      installed: [],
      installedAt: new Date().toISOString(),
    };
  }

  const combined = new Set([
    ...(state[projectPath].installed ?? []),
    ...snippetName,
  ]);

  state[projectPath].installed = Array.from(combined);
  state[projectPath].installedAt = new Date().toISOString();

  await writeState(state);
};
