import deepmerge from 'deepmerge';

export const jsonMerger = (target, source) => {
  const targetObject = target !== '' ? JSON.parse(target) : {};
  const sourceObject = source !== '' ? JSON.parse(source) : {};
  const mergedObject = deepmerge(targetObject, sourceObject);

  return JSON.stringify(mergedObject, null, 2);
};

export const plainMerger = (target, source) => {
  const targetEndsWithNewLine = Boolean(target.match(/[\r\n]+$/));
  const separator = `${targetEndsWithNewLine ? '' : '\n'}\n`;

  return target.concat(separator, source);
};
