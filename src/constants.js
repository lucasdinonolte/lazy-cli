import { join } from 'path';
import { homedir } from 'os';

export const CONFIG_FILE_NAME = '.lazy.config';
export const TEMPLATE_FILE_PREFIX = 'template.';
export const SNIPPETS_PATH = './snippets';
export const USER_SNIPPETS_DIR = join(homedir(), `.lazy-cli/snippets`);
