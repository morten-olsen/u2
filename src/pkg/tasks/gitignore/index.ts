import { Task } from '../task';

const setupGitIgnore: Task<any> = {
  name: 'gitignore',
  run: async ({ project }) => {
    const { root, workspaces } = project;

    {
      const gitignore = root.getFile('.gitignore').lines;
      gitignore.ensure('/node_modules/');
      gitignore.ensure('/dist/');
      gitignore.ensure('/*.logs');
      gitignore.ensure('/.yarn/');
    }

    for (const workspace of workspaces) {
      const gitignore = workspace.getFile('.gitignore').lines;
      gitignore.ensure('/node_modules/');
      gitignore.ensure('/dist/');
      gitignore.ensure('/*.logs');
    }
  },
};

export { setupGitIgnore };
