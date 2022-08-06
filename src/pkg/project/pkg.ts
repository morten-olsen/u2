import { PackageJson } from '../../types/package-json';
import { ensureDir, existsSync, writeFile } from 'fs-extra';
import { join, dirname } from 'path';
import { getTool, Tool } from './utils/tools';
import { get, set } from 'lodash';
import { PkgFile } from './files';
import { getLatestVersion } from './utils/npm';

type Dependency = {
  name: string;
  version?: string;
  overwrite?: boolean;
};
class Pkg {
  #location: string;
  #content: PackageJson;
  #tool: Tool;
  #files: PkgFile[] = [];
  #changed: boolean;

  constructor(location: string, root?: Pkg) {
    this.#location = location;
    const packageLocation = join(this.#location, 'package.json');
    this.#changed = false;
    if (existsSync(packageLocation)) {
      this.#content = require(join(location, 'package.json'));
      this.#tool = root ? root.tool : getTool(location, this.#content);
    } else {
      this.#content = {};
      this.#tool = root ? root.tool : 'yarn';
    }
  }

  public get exists() {
    return existsSync(join(this.#location, 'package.json'));
  }

  public get location() {
    return this.#location;
  }

  public get tool() {
    return this.#tool;
  }

  public get = (location: string) => {
    return get(this.#content, location);
  };

  public set = (location: string, value: any) => {
    this.#changed = true;
    set(this.#content, location, value);
  };

  public addDependency = async (dependency: Dependency) => {
    if (!this.#content.dependencies) {
      this.#content.dependencies = {};
    }
    if (this.#content.dependencies[dependency.name] && !dependency.overwrite) {
      return;
    }
    this.#changed = true;
    this.#content.dependencies[dependency.name] =
      dependency.version || (await getLatestVersion(dependency.name));
  };

  public addDevDependency = async (dependency: Dependency) => {
    if (!this.#content.devDependencies) {
      this.#content.devDependencies = {};
    }
    if (
      this.#content.devDependencies[dependency.name] &&
      !dependency.overwrite
    ) {
      return;
    }
    this.#changed = true;
    this.#content.devDependencies[dependency.name] =
      dependency.version || (await getLatestVersion(dependency.name));
  };

  public getFile = (location: string) => {
    let file = this.#files.find((file) => file.location === location);
    if (!file) {
      file = new PkgFile(this, location);
      this.#files.push(file);
    }
    return file;
  };

  public save = async () => {
    if (this.#changed) {
      await ensureDir(dirname(join(this.#location, 'package.json')));
      await writeFile(
        join(this.#location, 'package.json'),
        JSON.stringify(this.#content, null, 2)
      );
      this.#changed = false;
    }
    for (let file of this.#files) {
      await file.save();
    }
  };
}

export { Pkg };
