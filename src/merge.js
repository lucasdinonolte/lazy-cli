import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import fse from 'fs-extra';

import { jsonMerger, plainMerger } from './fileMergers.js';
import { maybeReadFile } from './util.js';
import { createLogger } from './logger.js';

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

export const mergeFile = (target, source, { logger = createLogger() }) => {
  const fileMerger = FILE_MERGERS.find(({ match }) => match.test(target)) ?? {
    merger: plainMerger,
  };

  logger.info(`Merging ${target}`);

  // Ensure the target file exists
  fse.ensureFileSync(target);

  const { merger } = fileMerger;
  const targetFile = maybeReadFile(target);
  const mergedFile = merger(targetFile, source);

  writeFileSync(target, mergedFile, 'utf8');
};

export const loadFile = (path, { snippetDir, targetDir }) => {
  const file = readFileSync(join(snippetDir, path), 'utf8');
  return {
    file,
    path: join(targetDir, path),
  };
};

export const includeTemplate = (template, inputs) => {
  if (!template.when) return true;
  if (typeof template.when === 'function') return template.when(inputs);
  return true;
};

const loadTemplate = (template, inputs) => {
  return {
    file:
      typeof template.src === 'function' ? template.src(inputs) : template.src,
    path:
      typeof template.dest === 'function'
        ? template.dest(inputs)
        : template.dest,
  };
};

export const mergeWithSnippet = (
  snippet,
  inputs,
  { cwd, logger = createLogger() },
) => {
  const snippetDir = snippet.path;

  (snippet.dependencies || []).forEach((dependency) => {
    mergeWithSnippet(dependency, inputs, { cwd });
  });

  let templates = [];
  if (snippet.config.templates && snippet.config.templates.length > 0) {
    templates = snippet.config.templates
      .filter((template) => includeTemplate(template, inputs))
      .map((template) => loadTemplate(template, { ...inputs, snippetDir }));
  }

  const files = snippet.files.map((file) =>
    loadFile(file, { snippetDir, targetDir: process.cwd() }),
  );

  const allFiles = [...templates, ...files];

  allFiles.forEach(({ file, path }) => {
    mergeFile(path, file, { logger });
  });
};
