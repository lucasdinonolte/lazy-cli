# Lazy CLI

A personal scaffolding and code generation tool, beacause I have better things to do than remembering how to set up ESLint or Prettier for the 1000th time.

Lazy CLI lets you create reusable "snippets" - code templates that can automatically configure or scaffold parts of your projects with smart defaults and interactive prompts.

## Features

- **Reusable Snippets**: Define templates once, use them everywhere
- **File Merging**: Intelligently merge JSON files, append/prepend to others
- **Project Context Detection**: Automatically detect frameworks (React, Next.js, Astro, Vite) and TypeScript
- **Snippet Dependencies**: Chain snippets together for complex setups

## Installation

### Global Installation (Personal Snippets)

```bash
npm install -g @lucasdinonolte/lazy-cli-cli
```

By default, `lazy-cli` will look for snippets in `~/.lazy-cli/snippets/`.

### Project-Specific Installation

```bash
npm install --save-dev @lucasdinonolte/lazy-cli
```

Add lazy to your project's npm scripts:

```json
{
  "scripts": {
    "scaffold": "lazy-cli --path ./snippets"
  }
}
```

## Usage

```bash
lazy-cli                           # Interactive snippet selection
lazy-cli my-snippet                # Run a specific snippet by name
lazy-cli --new                     # Create a new snippet
lazy-cli --path ./custom/snippets  # Use a custom snippets directory
lazy-cli --verbose                 # Enable debug logging
lazy-cli --help                    # Show help
lazy-cli --version                 # Show version
```

## Creating Snippets

Each snippet lives in its own directory with a configuration file. Create a new snippet using:

```bash
lazy-cli --new
```

Or manually create a directory in your snippets folder with a config file:

```
~/.lazy-cli/snippets/
  my-snippet/
    .lazy.config.ts    # Configuration file
    template.txt       # Template files (optional)
```

### Snippet Configuration

The config file (`.lazy.config.ts`, `.lazy.config.js`, `.lazy.config.cjs`, or `.lazy.config.mjs`) exports a snippet configuration:

```typescript
import { defineSnippet } from '@lucasdinonolte/lazy-cli';

export default defineSnippet({
  name: 'My Snippet',
  description: 'Sets up something useful',

  // Optional: run other snippets first
  dependencies: ['other-snippet'],

  // Prompts to collect user input
  prompts: [
    {
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?'
    }
  ],

  // Actions to perform (files to create/modify)
  actions: ({ data }) => [
    {
      path: 'README.md',
      template: `# ${data.projectName}\n\nWelcome!`,
      merger: 'overwrite'
    }
  ]
});
```

### Dynamic Configuration

Both `prompts` and `actions` can be functions that receive the execution context:

```typescript
export default defineSnippet({
  name: 'React Component',

  // Conditional prompts based on detected project context
  prompts: (projectContext) => {
    return [
      {
        name: 'name',
        type: 'text',
        message: 'Name',
        initial: projectContext.typescript ? 'Compponent.tsx' : 'Component.jsx',
      },
    ];
  },
  actions: ({ data, projectContext }) => {
    ...
  },
});
```

### Context Object

The context object (`ctx`) contains:

- `ctx.answers` - User's prompt responses
- `ctx.project.typescript` - Whether TypeScript is detected
- `ctx.project.framework` - Detected framework (`'react'`, `'nextjs'`, `'astro'`, `'vite'`, or `null`)

### File Merging Strategies

When writing files, you can specify how to handle existing content:

| Merger | Behavior |
|--------|----------|
| `overwrite` | Replace file contents entirely (default for most files) |
| `append` | Add content to end of file |
| `prepend` | Add content to beginning of file |
| `mergeJson` | Deep merge JSON objects (default for `.json` files) |

```typescript
actions: [
  { path: 'package.json', template: '{"scripts": {"test": "vitest"}}', merger: 'mergeJson' },
  { path: '.gitignore', template: 'node_modules/', merger: 'append' }
]
```

### String Formatters

Use built-in formatters in your templates:

```typescript
import { formatters } from '@lucasdinonolte/lazy-cli';

const name = 'my component';
formatters.camelCase(name);    // 'myComponent'
formatters.pascalCase(name);   // 'MyComponent'
formatters.slug(name);         // 'my-component'
formatters.filename(name);     // 'my-component' (filesystem-safe)
```

## State Tracking

Lazy CLI tracks which snippets have been installed in each project at `~/.lazy-cli/state.json`. This helps avoid re-running snippets unnecessarily.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format:fix

# Build
npm run build
```

## License

MIT
