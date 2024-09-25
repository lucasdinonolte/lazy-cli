import { join } from 'node:path';

import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import fuzzy from 'fuzzy';

import { loadCustomAndBuiltInSnippets } from './content.js';
import { mergeWithSnippet } from './merge.js';
import { getSnippetDir } from './paths.js';
import { createLogger } from './logger.js';

const main = async ({
  pathAddon = '',
  snippetsPath = undefined,
  flags = {},
} = {}) => {
  const customSnippetsDir = getSnippetDir(snippetsPath);
  const logger = createLogger(flags.verbose);

  const snippets = await loadCustomAndBuiltInSnippets(customSnippetsDir);
  const cwd = join(process.cwd(), pathAddon);

  logger.debug(`Found ${snippets.length} snippets from ${customSnippetsDir}`);
  logger.debug(`Current working directory: ${cwd}`);

  if (snippets.length === 0) {
    logger.error(`No snippets found. Looked in ${customSnippetsDir}`);
    return;
  }

  inquirer.registerPrompt('autocomplete', inquirerPrompt);
  const { snippet } = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'snippet',
      message: 'Which snippet do you want to run?',
      source: (_, input) => {
        const fuzzyResult = fuzzy.filter(input || '', snippets, {
          extract: (item) => item.config?.name ?? item.name,
        });
        return fuzzyResult.map((el) => el.original);
      },
    },
  ]);

  const selectedSnippet = snippets.find((s) => s.name === snippet);

  // Resolve dependencies
  // TODO: Decide if this still makes sense, or if we rather want to keep
  // things simpler.
  selectedSnippet.dependencies = selectedSnippet.config.dependencies
    ? selectedSnippet.config.dependencies.map((d) =>
        snippets.find((s) => s.name === d),
      )
    : [];

  logger.debug(
    `Snippet has ${selectedSnippet.dependencies.length} dependencies`,
  );

  // Get more prompts from the user if the snippet defined inputs
  let inputs = null;
  if (
    selectedSnippet.config.inputs &&
    selectedSnippet.config.inputs.length > 0
  ) {
    inputs = await inquirer.prompt(selectedSnippet.config.inputs);
  }

  // Run the merging logic
  mergeWithSnippet(
    selectedSnippet,
    { ...inputs, snippetsDir: customSnippetsDir },
    { cwd, logger },
  );
};

export default main;
