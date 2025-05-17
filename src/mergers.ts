import deepmerge from 'deepmerge';

type Merger = (target: string, source: string) => string;

/**
 * Appends the `source` string to the `target` string, ensuring proper newline separation.
 *
 * @param target - The target string to which the source will be appended.
 *                 If the target is an empty string, the source is returned as is.
 * @param source - The source string to append to the target.
 * @returns The concatenated string with appropriate newline separation.
 */
const append: Merger = (target, source) => {
  if (target === '') return source;

  const targetEndsWithNewLine = Boolean(target.match(/[\r\n]+$/));
  const separator = `${targetEndsWithNewLine ? '' : '\n'}\n`;

  return target.concat(separator, source);
};

/**
 * Prepends the `source` string to the `target` string, ensuring proper newline separation.
 *
 * @param target - The target string to which the source will be prepended.
 *                 If the target is an empty string, the source is returned as is.
 * @param source - The source string to prepend to the target.
 * @returns The concatenated string with appropriate newline separation.
 */
const prepend: Merger = (target, source) => {
  if (target === '') return source;

  const sourceEndsWithNewLine = Boolean(source.match(/[\r\n]+$/));
  const separator = `\n${sourceEndsWithNewLine ? '' : '\n'}`;

  return source.concat(separator, target);
};

/**
 * A merger function that overwrites the target with the source.
 *
 * @param _target - The original target value (ignored in this implementation).
 * @param source - The source value that will replace the target.
 * @returns The source value.
 */
const overwrite: Merger = (_target, source) => source;

/**
 * Merges two JSON strings into one by deeply merging their parsed objects.
 *
 * @param target - The target JSON string. If empty, it is treated as an empty object.
 * @param source - The source JSON string. If empty, it is treated as an empty object.
 * @returns A JSON string representing the deeply merged result of the target and source.
 * @throws Will throw an error if either `target` or `source` is not a valid JSON string.
 */
const mergeJson: Merger = (target, source) => {
  const targetObject = target !== '' ? JSON.parse(target) : {};
  const sourceObject = source !== '' ? JSON.parse(source) : {};
  const mergedObject = deepmerge(targetObject, sourceObject);

  return JSON.stringify(mergedObject, null, 2);
};

export const fileMergers = {
  append,
  prepend,
  overwrite,
  mergeJson,
} as const;

export type MergerType = keyof typeof fileMergers;

export const getMergerForPath = (
  path: string,
  mergerOverwrite?: MergerType,
): Merger => {
  if (mergerOverwrite) return fileMergers[mergerOverwrite];

  if (path.endsWith('.json')) return mergeJson;
  return append;
};
