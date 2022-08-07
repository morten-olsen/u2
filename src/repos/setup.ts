import { Command } from 'commander';
import { Repos } from '.';

const setupRepos = (commander: Command) => {
  const listReposCommand = commander.command('list');
  listReposCommand.alias('l');
  listReposCommand.action(async () => {
    const repos = new Repos();
    await repos.status();
  });

  const add = commander.command('add');
  add.alias('a');
  add.action(async () => {
    const repos = new Repos();
    await repos.add(process.cwd());
  });
};

export { setupRepos };
