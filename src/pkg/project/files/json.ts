import { PkgFile } from '.';
import { jsonProxy } from '../../../utils/proxy';

class JsonFile {
  #file: PkgFile;

  constructor(file: PkgFile) {
    this.#file = file;
  }

  public get file() {
    return this.#file;
  }

  public get content() {
    const value = JSON.parse(this.#file.content || '{}');
    return jsonProxy(value, () => {
      this.content = value;
    });
  }

  public set content(value: any) {
    this.#file.content = JSON.stringify(value, null, 2);
  }
}

export { JsonFile };
