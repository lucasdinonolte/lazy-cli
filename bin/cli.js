#!/usr/bin/env node
import main from '../src/index.js';

const args = process.argv.slice(2);
const pathAddon = args[0] || '';

main(pathAddon);
