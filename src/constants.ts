import { homedir } from 'node:os';
import { join } from 'node:path';

export const LAZY_CONFIG_FILE_NAME = '.lazy.config';

// Default snippets path
export const LAZY_DEFAULT_SNIPPETS_DIR = join(homedir(), `.lazy-cli/snippets`);
export const LAZY_CONFIG_FILE_GLOB = `**/${LAZY_CONFIG_FILE_NAME}.{js,cjs,mjs,ts}`;

// State keeps track of which snippets have been
// run in a given project, this is a cache file that's
// always stored in the user's home directory
export const LAZY_STATE_DIR = join(homedir(), '.lazy-cli');
export const LAZY_STATE_FILE = join(LAZY_STATE_DIR, 'state.json');
