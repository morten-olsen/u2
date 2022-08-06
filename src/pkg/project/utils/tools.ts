import { existsSync } from 'fs-extra';
import { join } from 'path';
import { PackageJson } from '../../../types/package-json';

type Tool = 'yarn' | 'npm' | 'pnpm';

const getTool = (
  root: string,
  pkg: PackageJson,
  fallback: Tool = 'yarn'
): Tool => {
  if (pkg.packageManager) {
    const [name] = pkg.packageManager.split('@');
    return name as Tool;
  }

  if (pkg.engines?.pnpm) {
    return 'pnpm';
  }

  if (pkg.engines?.yarn) {
    return 'yarn';
  }

  if (pkg.engines?.npm) {
    return 'npm';
  }

  if (existsSync(join(root, 'yarn.lock'))) {
    return 'yarn';
  }

  if (existsSync(join(root, 'package-lock.json'))) {
    return 'npm';
  }

  return fallback;
};

export type { Tool };
export { getTool };
