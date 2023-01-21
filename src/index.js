import { join } from 'node:path';

import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import fuzzy from 'fuzzy';

import { loadSnippets } from './content.js';
import { mergeWithSnippet } from './merge.js';

const main = async ({ pathAddon = '' } = {}) => {
  const snippets = loadSnippets();
  const cwd = join(process.cwd(), pathAddon);

  inquirer.registerPrompt('autocomplete', inquirerPrompt);
  const { snippet } = await inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'snippet',
      message: 'Which snippet do you want to run?',
      source: (_, input) => {
        const fuzzyResult = fuzzy.filter(input || '', snippets, {
          extract: (item) => item.name,
        });
        return fuzzyResult.map((el) => el.original);
      },
    },
  ]);

  const selectedSnippet = snippets.find((s) => s.name === snippet);

  // Resolve dependencies
  selectedSnippet.dependencies = selectedSnippet.config.dependencies
    ? selectedSnippet.config.dependencies.map((d) =>
        snippets.find((s) => s.name === d),
      )
    : [];

  // Get more prompts from the user if the snippet defined inputs
  let inputs = null;
  if (
    selectedSnippet.config.inputs &&
    selectedSnippet.config.inputs.length > 0
  ) {
    inputs = await inquirer.prompt(selectedSnippet.config.inputs);
  }

  // Run the merging logic
  mergeWithSnippet(selectedSnippet, inputs, { cwd });
};

export default main;
