import { program } from 'commander';
import { setupPkg } from '../pkg/setup';
import { setupRepos } from '../repos/setup';

const pkg = program.command('pkg');
pkg.alias('p');

const repos = program.command('repos');
repos.alias('r');

setupPkg(pkg);
setupRepos(repos);

program.parse(process.argv);
