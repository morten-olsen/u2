import ora from 'ora';
import { resolve } from 'path';
import { confirm, input, selectItems } from '../../utils/ask';
import { setScope, nameToString } from '../../utils/pkg';
import { Ask } from '../ask';
import { Project } from '../project';
import { getPackageRoot } from '../project/utils/mono-repo';
import { tasks } from '../tasks';
import { Task } from '../tasks/task';

const runTask = async <TConfig>(
  cwd: string,
  task: Task<TConfig>,
  config: TConfig
) => {
  const project = new Project(cwd);
  const getCurrent = () => {
    const root = getPackageRoot(cwd) || cwd;
    return project.get(root) || project.root;
  };
  const spinner = ora().start(task.name);
  await task.run(
    {
      cwd,
      project,
      getCurrent,
      isRoot: getCurrent() === project.root,
      ask: new Ask(spinner),
    },
    config
  );
  await project.save();
  spinner.succeed();
};

const prepareTask = async <TConfig>(cwd: string, task: Task<TConfig>) => {
  if (!task.prepare) {
    return;
  }
  const project = new Project(cwd);
  const getCurrent = () => {
    const root = getPackageRoot(cwd) || cwd;
    return project.get(root) || project.root;
  };
  const spinner = ora().start(task.name);
  await task.prepare({
    cwd,
    project,
    getCurrent,
    isRoot: getCurrent() === project.root,
    ask: new Ask(spinner),
  });
  await project.save();
  spinner.succeed();
};

const sketchSetup = async (cwd: string) => {
  const project = new Project(cwd);
  const scope = (await input('scope')) || undefined;
  const projectName = await input('name prefix');

  const getName = (name: string) => {
    const parts = [];
    if (scope) {
      parts.push('@', name, '/');
    }
    if (projectName) {
      parts.push(projectName, '-');
    }
    return [...parts, name].join('');
  };

  if (!project.root.exists) {
    await runTask(cwd, tasks.init, {
      name: getName('repo'),
    });
  }

  let pkgScaffold: (keyof typeof tasks)[] = ['ts'];

  while (true) {
    const location = await input('where?');
    if (!location) {
      break;
    }
    const parts = location.split('/');
    const name = getName(parts.pop()!);

    const target = resolve(cwd, location);
    await runTask(target, tasks.init, { name });
    pkgScaffold = (await selectItems(
      'scaffolds',
      Object.keys(tasks),
      pkgScaffold
    )) as any;
    for (let scaffold of pkgScaffold) {
      const task = tasks[scaffold];
      const config = await prepareTask(target, task);
      await runTask(target, task, config);
    }
  }
};

export { sketchSetup };
