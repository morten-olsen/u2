import { Task } from '../task';

type Config = {
  name: string;
};

const setupInit: Task<Config> = {
  name: 'init',
  prepare: async ({ cwd, current, ask }) => {
    if (current.location !== cwd) {
      return {
        name: ask.input('What is the name of your package?'),
      };
    }
    const name =
      current.get('name') ||
      (await ask.input('What is the name of your package?'));
    return {
      name,
    };
  },
  run: async ({ project, cwd }, { name }) => {
    const { root } = project;
    if (root.location !== cwd) {
      project.addWorkspace(cwd, name);
    } else {
      root.set('name', name);
      root.set('version', '1.0.0-alpha.0');
    }
  },
};

export { setupInit };
