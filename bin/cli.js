#!/usr/bin/env node
import main from '../src/index.js';
import { parseCLIFlags } from '../src/flags.js';

const args = process.argv.slice(2);
const snippetsPath = args[0];

const flags = parseCLIFlags(
  {
    verbose: ['--verbose'],
  },
  args,
);

main({ snippetsPath, flags });
