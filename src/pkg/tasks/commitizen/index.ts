import execa from 'execa';
import { Task } from '../task';

const setupCommitizen: Task<any> = {
  name: 'commitizen',
  run: async ({ project }) => {
    const { root } = project;
    await root.addDevDependency({ name: 'commitizen' });
    await root.addDevDependency({ name: 'husky' });
    await root.addDevDependency({ name: '@commitlint/cli' });
    await root.addDevDependency({ name: '@commitlint/config-conventional' });

    root.set('config.commitizen', {
      path: 'cz-conventional-changelog',
    });

    if (root.get('scripts.postinstall')) {
      root.set(
        'scripts.postinstall',
        root.get('scripts.postinstall') + ' && husky install'
      );
    } else {
      root.set('scripts.postinstall', 'husky install');
    }

    root.getFile('commitlint.config.js').content =
      "module.exports = { extends: '@commitlint/config-conventional' };";
  },
  finalize: async ({ project }) => {
    const { root } = project;
    await execa(
      root.tool,
      ['husky', 'add', '.husky/commit-msg', 'yarn commitlint --edit $1'],
      {
        cwd: root.location,
      }
    );
  },
};

export { setupCommitizen };
