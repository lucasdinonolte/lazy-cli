import { join } from 'node:path';

import { maybeReadJSONFile, pathExists } from './utils';

type FrameworkDetector = {
  name: string;
  detect: (allDeps: Record<string, string>) => boolean;
};

const frameworkDetectors: FrameworkDetector[] = [
  {
    name: 'astro',
    detect: (allDeps) => {
      if (allDeps['astro']) {
        return true;
      }
      return false;
    },
  },
  {
    name: 'react',
    detect: (allDeps) => {
      if (allDeps['react'] || allDeps['react-dom']) {
        return true;
      }
      return false;
    },
  },
  {
    name: 'vite',
    detect: (allDeps) => {
      if (allDeps['vite']) {
        return true;
      }
      return false;
    },
  },
  {
    name: 'nextjs',
    detect: (allDeps) => {
      if (allDeps['next']) {
        return true;
      }
      return false;
    },
  },
] as const;

type Framework = string;

/**
 * Tries to determine the framework used in a project by
 * checking for specific files or dependencies.
 */
const detectFramework = async (
  rootPath: string,
  detectors: FrameworkDetector[] = frameworkDetectors,
): Promise<Framework[]> => {
  const packageJson = await maybeReadJSONFile<{
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  }>(join(rootPath, 'package.json'));

  const allDeps = {
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies,
  };

  const detectedFrameworks = [];
  for (const detector of detectors) {
    const detected = await detector.detect(allDeps || {});
    if (detected) {
      detectedFrameworks.push(detector.name);
    }
  }

  return detectedFrameworks;
};

/**
 * Checks if the project is configured to use
 * typescript.
 */
const detectTypeScript = async (rootPath: string): Promise<boolean> => {
  const tsConfigPath = join(rootPath, 'tsconfig.json');
  return pathExists(tsConfigPath);
};

/**
 * Detects the project's environment.
 */
export type ProjectContext = {
  frameworks: Framework[];
  typescript?: boolean;
};

export async function detectEnvironment(
  rootPath: string,
): Promise<ProjectContext> {
  const [frameworks, typescript] = await Promise.all([
    detectFramework(rootPath),
    detectTypeScript(rootPath),
  ]);

  return {
    frameworks,
    typescript,
  };
}
