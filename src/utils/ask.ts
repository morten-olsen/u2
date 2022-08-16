import inquirer from 'inquirer';

export const confirm = async (msg: string) => {
  const { answer } = await inquirer.prompt({
    type: 'confirm',
    name: 'answer',
    message: msg,
  });

  return answer as boolean;
};

export const input = async (msg: string) => {
  const { answer } = await inquirer.prompt({
    type: 'input',
    name: 'answer',
    message: msg,
  });

  return answer as string;
};

export const selectItems = async (
  msg: string,
  items: string[],
  pre?: string[]
) => {
  const { answer } = await inquirer.prompt({
    type: 'checkbox',
    name: 'answer',
    message: msg,
    choices: items,
    default: pre,
  });

  return answer as string[];
};
