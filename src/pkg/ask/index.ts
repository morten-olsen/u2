import inquirer from 'inquirer';
import { Ora } from 'ora';

class Ask {
  #spinner: Ora;

  constructor(spinner: Ora) {
    this.#spinner = spinner;
  }

  public input = async (question: string, pre?: string) => {
    this.#spinner.stop();
    const answer = await inquirer.prompt([
      {
        message: question,
        name: 'answer',
        type: 'input',
        default: pre,
      },
    ]);
    this.#spinner.start();
    return answer.answer;
  };
}

export { Ask };
