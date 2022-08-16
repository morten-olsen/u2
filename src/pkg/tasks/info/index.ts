import simpleGit from 'simple-git';
import { parseName, setScope, nameToString } from '../../../utils/pkg';
import { Task } from '../task';

const setupInfo: Task = {
  name: 'info',
  run: async ({ project }) => {
    const { root, workspaces } = project;
    const git = simpleGit(root.location);
    const name = parseName(root.get('name'));
    if (await git.checkIsRepo()) {
      const [remote] = await git.listRemote();
      if (remote) {
        root.set('repostitory', {
          type: 'git',
          url: remote,
        });
      }
    }

    workspaces.forEach((workspace) => {
      workspace.set(
        'name',
        nameToString(setScope(workspace.get('name'), name.scope))
      );
      workspace.set('repostitory', root.get('repostitory'));
      workspace.set('license', root.get('license'));
      workspace.set('packageManager', root.get('packageManager'));
    });
  },
};

export { setupInfo };
