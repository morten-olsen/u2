import { TaskNames, tasks } from './tasks';
import ora from 'ora';
import { Task } from './tasks/task';
import { Ask } from './ask';
import { Project } from './project';
import { getPackageRoot } from './project/utils/mono-repo';

class Flow {
  #location: string;
  #tasks: Task<any>[];

  constructor(location: string, taskNames: TaskNames[]) {
    this.#location = location;
    this.#tasks = taskNames.map((name) => {
      const task = tasks[name];
      if (!task) {
        throw new Error(`Task ${name} not found`);
      }
      return task;
    });
  }

  #getCurrent(project: Project) {
    const root = getPackageRoot(this.#location) || this.#location;
    return project.get(root) || project.root;
  }

  #getTaskOptions() {
    const project = new Project(this.#location);
    const getCurrent = () => this.#getCurrent(project);
    const isRoot = project.root === this.#getCurrent(project);
    const spinner = ora().start();
    return {
      project,
      getCurrent,
      isRoot,
      cwd: this.#location,
      ask: new Ask(spinner),
      spinner,
    };
  }

  public run = async () => {
    let configs: any[] = [];
    {
      console.log('\nPrepare');
      const { spinner, ...options } = this.#getTaskOptions();
      for (let i = 0; i < this.#tasks.length; i++) {
        const task = this.#tasks[i];
        spinner.text = `${task.name} (${i + 1}/${this.#tasks.length})`;
        if (!task.prepare) {
          configs.push(undefined);
          continue;
        }
        const config = await task.prepare(options);
        configs.push(config);
      }
      await options.project.save();
      spinner.succeed('done');
    }
    {
      console.log('\nRun');
      const { spinner, ...options } = this.#getTaskOptions();
      for (let i = 0; i < this.#tasks.length; i++) {
        const task = this.#tasks[i];
        spinner.text = `${task.name} (${i + 1}/${this.#tasks.length})`;
        await task.run(options, configs[i]);
      }
      await options.project.save();
      spinner.succeed('done');
    }
    const project = new Project(this.#location);

    console.log('\nInstall');
    await project.install();
    {
      console.log('\nFinalize');
      const { spinner, ...options } = this.#getTaskOptions();
      for (let i = 0; i < this.#tasks.length; i++) {
        const task = this.#tasks[i];
        spinner.text = `${task.name} (${i + 1}/${this.#tasks.length})`;
        if (!task.finalize) {
          continue;
        }
        await task.finalize(options, configs[i]);
      }
      await options.project.save();
      spinner.succeed('done');
    }
  };
}

export { Flow };
