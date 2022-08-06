import ora from 'ora';
import execa from 'execa';
import { relative } from 'path';
import { Pkg } from './pkg';
import { getPackages, getProjectRoot } from './utils/mono-repo';

class Project {
  #root: Pkg;
  #workspaces: Pkg[];
  #isMonoRepo: boolean;

  constructor(location: string) {
    const rootLocation = getProjectRoot(location) || location;
    this.#root = new Pkg(rootLocation);
    const workspaces = getPackages(this.#root.location, this.#root.tool);
    this.#isMonoRepo = !!workspaces;
    this.#workspaces = (workspaces || []).map(
      (location) => new Pkg(location, this.#root)
    );
  }

  public get root() {
    return this.#root;
  }

  public get workspaces() {
    return [...this.#workspaces];
  }

  public get isMonoRepo() {
    return this.#isMonoRepo;
  }

  public makeMonoRepo() {
    if (this.#isMonoRepo) {
      return;
    }
    this.#root.set('private', true);
    this.#root.set('workspaces', []);
    this.#isMonoRepo = true;
  }

  public get = (location: string) => {
    if (this.#root.location === location) {
      return this.#root;
    }
    return this.#workspaces.find((pkg) => pkg.location === location);
  };

  public addWorkspace = async (location: string, name: string) => {
    const pkg = new Pkg(location, this.#root);
    pkg.set('name', name);
    pkg.set('version', this.#root.get('version'));
    this.#workspaces.push(pkg);
    if (!this.#isMonoRepo) {
      if (this.#root.tool === 'pnpm') {
        throw new Error('does not support converting to mono repo with pnpm');
      }
      this.#root.set('private', true);
      this.#isMonoRepo = true;
    }
    this.#root.set('workspaces', [
      ...(this.#root.get('workspaces') || []),
      relative(this.#root.location, pkg.location),
    ]);
    return pkg;
  };

  public install = async () => {
    const spinner = ora('installing dependencies').start();
    await execa(this.#root.tool, ['install'], {
      cwd: this.#root.location,
    });
    spinner.succeed('dependencies installed');
  };

  public save = async () => {
    await this.#root.save();
    for (let pkg of this.#workspaces) {
      await pkg.save();
    }
  };
}

export { Project };
