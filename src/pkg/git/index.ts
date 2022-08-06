import { ensureDir, existsSync } from 'fs-extra';
import inquirer from 'inquirer';
import simpleGit, { CleanOptions } from 'simple-git';
import { getProjectRoot } from '../project/utils/mono-repo';

export const withGitRollback =
  <TArgs extends any[], TOutput extends any>(
    location: string,
    task: (...args: TArgs) => Promise<TOutput>
  ) =>
  async (...args: TArgs) => {
    const root = getProjectRoot(location) || location;
    if (!existsSync(root)) {
      ensureDir(root);
    }
    const git = simpleGit(root);
    if (!(await git.checkIsRepo())) {
      await git.init();
    }
    let preStatus = await git.status();
    let isClean = preStatus.isClean();
    if (!isClean) {
      const { answer } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'answer',
          message:
            'The repository is not clean. Are you sure you want to continue?',
          default: false,
        },
      ]);
      if (!answer) {
        process.exit(1);
      }
    }

    try {
      await task(...args);
      const postStatus = await git.status();
      if (isClean) {
        console.log(postStatus.files);
      }
    } catch (err) {
      if (isClean) {
        await git.clean(CleanOptions.FORCE + CleanOptions.RECURSIVE);
        await git.reset(['--hard']);
      }
      throw err;
    }
  };
