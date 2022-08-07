import chalk from 'chalk';
import { existsSync } from 'fs-extra';
import simpleGit from 'simple-git';
import { Repo } from '..';

type Branch = {
  repo?: Repo;
  branches: {
    [key: string]: Branch;
  };
};

export const buildTree = (repos: Repo[]) => {
  const tree: Branch = {
    branches: {},
  };

  for (let repo of repos) {
    const path = repo.location.split('/');
    let branch = tree;

    for (let segment of path) {
      if (branch.branches[segment] === undefined) {
        branch.branches[segment] = {
          branches: {},
        };
      }
      branch = branch.branches[segment];
    }

    branch.repo = repo;
  }

  return skipRootLevels(tree);
};

export const skipRootLevels = (branch: Branch): Branch => {
  let result = branch;
  while (Object.keys(result.branches).length === 1 && !result.repo) {
    result = result.branches[Object.keys(result.branches)[0]];
  }
  return result;
};

export const printBranch = async (branch: Branch, level: number = 0) => {
  const indent = '  '.repeat(level);
  if (branch.repo) {
    if (!existsSync(branch.repo.location)) {
      console.log(`${indent}${chalk.red('not found')}`);
    } else {
      const git = simpleGit(branch.repo.location);
      const status = await git.status();
      const { current: branchName } = await git.branch();
      const clean = status.isClean();

      console.log(
        `${indent}${chalk.green(branchName || '[none]')}${
          clean ? '' : chalk.red('*')
        }`
      );
    }
  }
  for (let key in branch.branches) {
    console.log(`${indent}${key}`);
    await printBranch(branch.branches[key], level + 1);
  }
};
