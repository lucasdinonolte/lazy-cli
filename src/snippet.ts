import { join } from 'path';

import type { ResolvedSnippet, SnippetConfig } from './content';

export const createSnippet = ({
  name,
  description,
  dependencies,
  prompts,
  actions,
}: SnippetConfig) => {
  return {
    name,
    description,
    dependencies: dependencies || [],
    prompts,
    actions,
  };
};

export const resolveSnippet = (
  id: string,
  snippet: SnippetConfig,
): ResolvedSnippet => {
  return {
    ...snippet,
    id,
  };
};

/**
 * A snippet that can be used to create a new snippet.
 * Such meta. Much wow.
 */
export const newSnippet = resolveSnippet(
  'new',
  createSnippet({
    name: 'New Snippet',
    prompts: [
      {
        name: 'name',
        type: 'text',
        message: 'Name',
        initial: 'My Snippet',
      },
    ],
    actions: ({ name, snippetsPath }, { toSlug }) => {
      return [
        {
          merger: 'overwrite',
          template: `export default {
  name: '${name}',
  prompts: [],
  actions: () => {
    return [
      /**
       * merger: 'overwrite',
       * template: 'Hello',
       * path: 'path/to/file',
       */
    ];
  }
}`,
          path: `${join(snippetsPath, toSlug(name))}/.lazy.config.ts`,
        },
      ];
    },
  }),
);
