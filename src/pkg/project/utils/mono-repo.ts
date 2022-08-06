import { existsSync, readJsonSync, readFileSync } from 'fs-extra';
import yaml from 'yaml';
import { sync as findUpSync } from 'find-up';
import { join } from 'path';
import { sync as globbySync } from 'globby';
import { getTool, Tool } from './tools';

export const getWorkspaceRoot = (cwd: string) => {
  const workspaceRoot = findUpSync(
    (directory) => {
      const pkgJsonLocation = join(directory, 'package.json');
      if (!existsSync(pkgJsonLocation)) {
        return undefined;
      }
      const pkg = readJsonSync(pkgJsonLocation);
      const tool = getTool(directory, pkg);
      const pkgs = getPackages(directory, tool);

      return typeof pkgs === 'undefined' ? undefined : directory;
    },
    {
      cwd,
      type: 'directory',
    }
  );
  return workspaceRoot;
};

export const getPackageRoot = (cwd: string) => {
  const packageRoot = findUpSync(
    (directory) => {
      const pkgJsonLocation = join(directory, 'package.json');
      if (!existsSync(pkgJsonLocation)) {
        return undefined;
      }
      return directory;
    },
    {
      cwd,
      type: 'directory',
    }
  );
  return packageRoot;
};

export const getProjectRoot = (cwd: string) => {
  return getWorkspaceRoot(cwd) || getPackageRoot(cwd);
};

export const getPackages = (cwd: string, tool: Tool) => {
  let globs: string[] | undefined;
  if (!existsSync(join(cwd, 'package.json'))) {
    return undefined;
  }
    
  const pkg = require(join(cwd, 'package.json'));

  if (existsSync(join(cwd, 'lerna.json'))) {
    const lerna = readJsonSync(join(cwd, 'lerna.json'));
    if (lerna.workspaces) {
      globs = lerna.workspaces;
    }
  } else if (tool === 'pnpm') {
    const workspaceLocation = join(cwd, 'pnpm-workspace.yaml');
    if (existsSync(workspaceLocation)) {
      const workspaces = yaml.parse(readFileSync(workspaceLocation, 'utf-8'));
      globs = workspaces.packages;
    }
  } else if (pkg.workspaces) {
    globs = pkg.workspaces as string[];
  }

  if (!globs) {
    return undefined;
  }

  const relativeDirectories = globbySync(globs, {
    cwd: cwd,
    onlyDirectories: true,
    expandDirectories: false,
    ignore: ['**/node_modules'],
  });

  const directories = relativeDirectories.map((p) => join(cwd, p));
  return directories;
};
