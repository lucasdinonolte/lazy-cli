import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import fse from 'fs-extra';

import deepmerge from 'deepmerge';

const FILE_MERGERS = [
  {
    match: /package\.json$/,
    merger: jsonMerger,
  },
  {
    match: /\.(eslintrc|json|prettierrc)$/,
    merger: jsonMerger,
  },
  {
    match: /.gitignore$/,
    merger: plainMerger,
  },
];

function jsonMerger(target, source) {
  const targetObject = target !== '' ? JSON.parse(target) : {};
  const sourceObject = source !== '' ? JSON.parse(source) : {};
  const mergedObject = deepmerge(targetObject, sourceObject);

  return JSON.stringify(mergedObject, null, 2);
}

function plainMerger(target, source) {
  const targetEndsWithNewLine = Boolean(target.match(/[\r\n]+$/));
  const separator = `${targetEndsWithNewLine ? '' : '\n'}\n`;

  return target.concat(separator, source);
}

function mergeFile(target, source) {
  const fileMerger = FILE_MERGERS.find(({ match }) => match.test(target));

  console.log(`Merging ${target}`);

  // Ensure the target file exists
  fse.ensureFileSync(target);

  if (!fileMerger) {
    fse.copySync(source, target);
  } else {
    const { merger } = fileMerger;
    const targetFile = readFileSync(target, 'utf8');
    const sourceFile = readFileSync(source, 'utf8');
    const mergedFile = merger(targetFile, sourceFile);

    writeFileSync(target, mergedFile, 'utf8');
  }
}

export const mergeWithSnippet = (snippet) => {
  const targetDir = process.cwd();
  const snippetDir = snippet.path;

  (snippet.dependencies || []).forEach((dependency) => {
    mergeWithSnippet(dependency);
  });

  snippet.files.forEach((file) => {
    const targetFile = join(targetDir, file);
    const snippetFile = join(snippetDir, file);

    mergeFile(targetFile, snippetFile);
  });
};
