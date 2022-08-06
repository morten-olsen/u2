import { Command } from 'commander';
import { Flow } from '.';
import { resolve } from 'path';
import { withGitRollback } from './git';

const setupPkg = (commander: Command) => {
  const scaffold = commander.command('scaffold <names> [location]');
  scaffold.alias('s');
  scaffold.action(async (names, location = process.cwd()) => {
    const actualLocation = resolve(location);
    withGitRollback(actualLocation, async () => {
      const taskNames = [
        ...new Set(['init', ...names.split(','), 'gitignore']),
      ];
      const flow = new Flow(actualLocation, taskNames);
      await flow.run();
    })();
  });
};

export { setupPkg };
