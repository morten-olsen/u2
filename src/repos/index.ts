import { jsonFileProxy } from '../utils/proxy';
import envPaths from 'env-paths';
import { join } from 'path';
import simpleGit from 'simple-git';
import { buildTree, printBranch } from './utils/tree';

type Repo = {
  location: string;
};

type Config = {
  repos: Repo[];
};

class Repos {
  #config: Config;

  constructor() {
    const paths = envPaths('u2');
    const location = join(paths.config, 'repos.json');
    this.#config = jsonFileProxy<Config>(location, { repos: [] });
  }

  public get repos() {
    return this.#config.repos;
  }

  public status = async () => {
    const tree = buildTree(this.repos);
    printBranch(tree);
  };

  public add = async (location: string) => {
    const git = simpleGit(location);
    const root = await git.revparse(['--show-toplevel']);
    if (this.repos.find((r) => r.location === root)) {
      console.log('Repo already exists');
      return;
    }
    this.#config.repos.push({ location: root });
  };
}

export type { Repo };
export { Repos };
