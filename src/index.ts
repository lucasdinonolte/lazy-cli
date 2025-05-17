import prompts from 'prompts';

import pkg from '../package.json';
import { LAZY_DEFAULT_SNIPPETS_DIR } from './constants';
import { loadSnippets, resolveActions, runActions } from './content';
import { Context } from './context';
import { createLogger } from './logger';
import { newSnippet } from './snippet';
import { parseCLIArgs, pathExists } from './utils';

export default async function main(argv: Array<string>) {
  const cli = parseCLIArgs<
    { help?: boolean; path?: string; verbose?: boolean; version?: boolean },
    string
  >(argv, '');

  const logger = createLogger(cli.flags.verbose ?? false);

  const panic = (message: string, exitCode: number = 1) => {
    logger.error(message);
    process.exit(exitCode);
  };

  // Version flag
  if (cli.flags.version) {
    logger.log(pkg.version);
    process.exit(0);
  }

  // Help flag
  if (cli.flags.help) {
    logger.log(`
    Usage
      $ lazy [snippet]

    Options
      --help      Show this help message
      --path      Set path to snippets directory (~/.lazy-cli/snippets will be used by default)
      --verbose   Enable verbose logging
      --version   Show version number

    Examples
      $ lazy
      $ lazy my-snippet
      $ lazy --path ./snippets
    `);
    process.exit(0);
  }

  const ctx: Context = { logger };

  const snippetsPath = cli.flags.path ?? LAZY_DEFAULT_SNIPPETS_DIR;

  // Ensure the snippets path exists
  const exists = await pathExists(snippetsPath);

  if (!exists) panic(`Snippets path does not exist: ${snippetsPath}`);

  // Load available snippets
  const snippets = await loadSnippets(snippetsPath, ctx);
  logger.debug(`Found ${snippets.length} snippets in ${snippetsPath}`);

  if (snippets.length === 0) {
    panic(`No snippets found in ${snippetsPath}`);
    return;
  }

  // Select snippet to run
  let selectedSnippetId: string;

  if (cli.command !== '') {
    selectedSnippetId = cli.command;
    logger.debug(`Running snippet from CLI argument ${selectedSnippetId}`);
  } else {
    const { value } = await prompts(
      {
        type: 'autocomplete',
        name: 'value',
        message: 'Select a snippet to run',
        choices: snippets.map((s) => ({ title: s.name, value: s.id })),
      },
      {
        onCancel: () => {
          logger.info('No snippet selected, exiting...');
          process.exit(0);
        },
      },
    );

    selectedSnippetId = value;
  }

  const selectedSnippet = [...snippets, newSnippet].find(
    (s) => s.id === selectedSnippetId,
  );

  if (!selectedSnippet) {
    return panic('Invalid snippet selected');
  }

  const dependencies = (selectedSnippet.dependencies ?? []).map((dep) => {
    const resolvedDependency = snippets.find((s) => s.name === dep);

    if (!resolvedDependency) {
      return panic(`Dependency not found: ${dep}`);
    }

    return resolvedDependency;
  });

  const filesToMerge = [];

  // First collect the data for all snippets.
  // This is useful, as it'll allow the user to
  // cancel out of the prompt at any stage, without
  // any of the previous dependencies being merged.
  for (const snippet of [...dependencies, selectedSnippet]) {
    const data = await prompts(snippet.prompts, {
      onCancel: () => {
        logger.info('Prompt cancelled, exiting...');
        process.exit(0);
      },
    });
    filesToMerge.push(resolveActions(snippet, { ...data, snippetsPath }));
  }

  // Merge all files with all actions
  for (const files of filesToMerge) {
    if (files.length === 0) {
      logger.info('No actions to run, skipping...');
    }
    await runActions(files, ctx);
  }
}

export { createSnippet } from './snippet';
