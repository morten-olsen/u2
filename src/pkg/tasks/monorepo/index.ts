import { Task } from '../task';

const setupMonorepo: Task<any> = {
  name: 'monorepo',
  run: async ({ project }) => {
    project.makeMonoRepo();
  },
};

export { setupMonorepo };
