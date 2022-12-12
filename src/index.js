import inquirer from 'inquirer';

import { loadSnippets } from './content.js';
import { mergeWithSnippet } from './merge.js';

const main = async () => {
  const snippets = loadSnippets();

  const { snippet } = await inquirer.prompt([
    {
      type: 'list',
      name: 'snippet',
      message: 'Which snippet do you want to run?',
      choices: snippets.map((s) => ({ value: s.name, name: s.config.name })),
    },
  ]);

  const selectedSnippet = snippets.find((s) => s.name === snippet);

  // Resolve depedencies
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
  mergeWithSnippet(selectedSnippet, inputs);
};

export default main;
