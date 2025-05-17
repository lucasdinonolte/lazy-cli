import { homedir } from 'node:os';
import { join } from 'node:path';

export const LAZY_CONFIG_FILE_NAME = '.lazy.config';
export const LAZY_DEFAULT_SNIPPETS_DIR = join(homedir(), `.lazy-cli/snippets`);
export const LAZY_CONFIG_FILE_GLOB = `**/${LAZY_CONFIG_FILE_NAME}.{js,cjs,mjs,ts}`;
