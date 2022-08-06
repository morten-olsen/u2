import { ensureDir, existsSync, readFileSync, writeFile } from 'fs-extra';
import { join, dirname } from 'path';
import { Pkg } from '../pkg';
import { JsonFile } from './json';
import { LinesFile } from './lines';

class PkgFile {
  #location: string;
  #pkg: Pkg;
  #content: string;
  #changed: boolean;

  constructor(pkg: Pkg, location: string) {
    this.#location = location;
    this.#pkg = pkg;
    if (this.exists) {
      this.#changed = false;
      this.#content = readFileSync(this.absoluteLocation, 'utf8');
    } else {
      this.#changed = true;
      this.#content = '';
    }
  }

  public get location() {
    return this.#location;
  }

  public get absoluteLocation() {
    return join(this.#pkg.location, this.#location);
  }

  public get exists() {
    return existsSync(this.absoluteLocation);
  }

  public get content() {
    return this.#content;
  }

  public get json() {
    return new JsonFile(this);
  }

  public get lines() {
    return new LinesFile(this);
  }

  public set content(value: string) {
    this.#content = value;
    this.#changed = true;
  }

  public save = async () => {
    if (!this.#changed) {
      return;
    }
    await ensureDir(dirname(this.absoluteLocation));
    await writeFile(this.absoluteLocation, this.#content);
  };
}

export { PkgFile };
