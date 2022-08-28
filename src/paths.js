import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the cjs equivalent of __dirname
// eslint-disable-next-line
export const __dirname = dirname(fileURLToPath(import.meta.url));
