import type { PromptObject } from 'prompts';
import type prompts from 'prompts';

import type { ProjectContext } from './environment';
import type { StringUtils } from './formatters';
import { fileMergers } from './mergers';

export type Merger = (target: string, source: string) => string;
export type MergerType = keyof typeof fileMergers;

type FileAction = {
  merger?: MergerType;
  template: string;
  path: string;
};

export type Action = FileAction;

export type SnippetConfig = {
  name: string;
  description?: string;
  dependencies?: Array<string>;
  prompts:
    | Array<PromptObject<string>>
    | ((projectContext: ProjectContext) => Array<PromptObject<string>>);
  actions:
    | Array<Action>
    | ((
        context: {
          data: prompts.Answers<string>;
          snippetsPath: string;
          projectContext: ProjectContext;
        },
        stringUtils: StringUtils,
      ) => Array<Action>);
};

export type ResolvedSnippet = SnippetConfig & {
  id: string;
};
