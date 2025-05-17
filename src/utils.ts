import parseArgs from 'minimist';
import { access, mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';

/**
 * Checks if the given path exists.
 */
export const pathExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

/**
 * Reads a file or returns an empty string.
 */
export const maybeReadFile = async (path: string) => {
  try {
    const file = await readFile(path, 'utf8');
    return file;
  } catch {
    return '';
  }
};

/**
 * Ensures a path exists, creating it if
 * it does not, including parent directories.
 */
export const ensureParentDirectoryExists = async (path: string) => {
  try {
    const dir = dirname(path);
    await mkdir(dir, { recursive: true });
  } catch {
    // noop
  }
};

/**
 * Omits given keys from an object.
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: Array<K>,
): Omit<T, K> => {
  const res = { ...obj };
  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete res[key];
  }
  return res;
};

/**
 * Returns a record of flags and their values.
 */
export const parseCLIArgs = <T extends object, U>(
  args: Array<string>,
  defaultCommand: U,
): {
  command: U;
  flags: T;
} => {
  const res = parseArgs(args);

  return {
    command: res._.length > 0 ? (res._[0] as U) : defaultCommand,
    flags: omit(res, ['_']) as T,
  };
};
