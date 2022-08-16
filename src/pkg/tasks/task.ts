import { Ask } from '../ask';
import { Project } from '../project';
import { Pkg } from '../project/pkg';

type TaskOptions = {
  cwd: string;
  project: Project;
  getCurrent: () => Pkg;
  isRoot: boolean;
  ask: Ask;
};

type Task<Config = undefined> = {
  readonly name: string;
  readonly prepare?: (options: TaskOptions) => Promise<Config>;
  readonly run: (options: TaskOptions, config: Config) => Promise<void>;
  readonly finalize?: (options: TaskOptions, config: Config) => Promise<void>;
};

export type { TaskOptions, Task };
