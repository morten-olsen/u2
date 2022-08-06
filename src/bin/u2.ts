import { program } from 'commander';
import { setupPkg } from '../pkg/setup';

const pkg = program.command('pkg');
pkg.alias('p');

setupPkg(pkg);

program.parse(process.argv);
