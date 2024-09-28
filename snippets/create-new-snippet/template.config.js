export default function template({ name, description }) {
  return `const snippet = ${JSON.stringify(
    {
      name,
      description,
      inputs: [
        {
          name: 'sample',
          description: 'A sample input',
          type: 'text',
          default: 'Sample response',
        },
      ],
      templates: [],
    },
    null,
    2,
  )};

export default snippet;`;
}
