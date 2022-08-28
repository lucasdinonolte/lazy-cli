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

  mergeWithSnippet(selectedSnippet);
};

export default main;
