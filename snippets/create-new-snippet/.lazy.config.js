import configTemplate from './template.config.js';

const snippet = {
  name: 'create-new-snippet',
  description: 'Creates a new Lazy Snippet in your snippet folder',
  inputs: [
    {
      name: 'name',
      description: 'The name of the snippet',
      type: 'text',
      default: 'new-snippet',
    },
    {
      name: 'description',
      description: 'The description of the snippet',
      type: 'text',
      default: 'A new snippet',
    },
  ],
  templates: [
    {
      src: configTemplate,
      when: ({ name }) => name !== 'hello',
      dest: ({ snippetsDir, name }) => `${snippetsDir}/${name}/.lazy.config.js`,
    },
  ],
};

export default snippet;
