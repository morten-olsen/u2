import { PkgFile } from '.';

class LinesFile {
  #file: PkgFile;

  constructor(file: PkgFile) {
    this.#file = file;
  }

  public get file() {
    return this.#file;
  }

  public get lines() {
    return this.#file.content.split('\n');
  }

  public ensure = (line: string) => {
    if (this.lines.includes(line)) {
      return;
    }
    this.#file.content += `\n${line}`;
  };
}

export { LinesFile };
