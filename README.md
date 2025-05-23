# Lazy CLI

Because I have better things to do than remembering how to set up eslint or
prettier for the 1000th time.

## Using global snippets

First install the CLI globally.

```zsh
npm install -g @lucasdinonolte/lazy-cli
```

By default `lazy` will look for snippets in `~/.lazy-cli/snippets/`.


```zsh
lazy
```

## Project specific usage

You can also point `lazy` to a custom snippets folder inside of a project.

Start by installing `lazy` into your project as a dev dependency.

```zsh
npm install --save-dev @lucasdinonolte/lazy-cli
```

Next add lazy to your project’s scripts.

```zsh
...
  "scaffold": "lazy --path ./path/to/snippetsFoler",
...
```
