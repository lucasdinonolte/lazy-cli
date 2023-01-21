#!/usr/bin/env node
import main from '../src/index.js';

const args = process.argv.slice(2);
const snippetsPath = args[0];

main({ snippetsPath });
