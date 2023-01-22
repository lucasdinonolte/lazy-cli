import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import fse from 'fs-extra';
import Handlebars from 'handlebars';

import { jsonMerger, plainMerger } from './fileMergers.js';

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

const COMPARISONS = {
  eq: (a, b) => a === b,
  ne: (a, b) => a !== b,
  gt: (a, b) => a > b,
  gte: (a, b) => a >= b,
  lt: (a, b) => a < b,
  lte: (a, b) => a <= b,
  in: (a, b) => b.includes(a),
};

export const mergeFile = (target, source) => {
  const fileMerger = FILE_MERGERS.find(({ match }) => match.test(target));

  console.log(`Merging ${target}`);

  // Ensure the target file exists
  fse.ensureFileSync(target);

  if (!fileMerger) {
    writeFileSync(target, source, 'utf8');
  } else {
    const { merger } = fileMerger;
    const targetFile = readFileSync(target, 'utf8');
    const mergedFile = merger(targetFile, source);

    writeFileSync(target, mergedFile, 'utf8');
  }
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

  for (const [key, comparison] of Object.entries(template.when)) {
    for (const [operator, value] of Object.entries(comparison)) {
      if (!COMPARISONS[operator](inputs[key], value)) {
        return false;
      }
    }
  }

  return true;
};

const loadTemplate = (template, inputs, { snippetDir, targetDir }) => {
  const templateFile = join(snippetDir, template.src);
  const templateCode = readFileSync(templateFile, 'utf8');
  const templateHbs = Handlebars.compile(templateCode);

  const outFileHbs = Handlebars.compile(join(targetDir, template.dest));

  return {
    file: templateHbs(inputs),
    path: outFileHbs(inputs),
  };
};

export const mergeWithSnippet = (snippet, inputs, { cwd }) => {
  const targetDir = '';
  const snippetDir = snippet.path;

  (snippet.dependencies || []).forEach((dependency) => {
    mergeWithSnippet(dependency, inputs, { cwd });
  });

  let templates = [];
  if (snippet.config.templates && snippet.config.templates.length > 0) {
    templates = snippet.config.templates
      .filter((template) => includeTemplate(template, inputs))
      .map((template) =>
        loadTemplate(template, inputs, { snippetDir, targetDir }),
      );
  }

  const files = snippet.files.map((file) =>
    loadFile(file, { snippetDir, targetDir }),
  );

  const allFiles = [...templates, ...files];

  allFiles.forEach(({ file, path }) => {
    mergeFile(path, file);
  });
};
