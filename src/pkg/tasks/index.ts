import { setupCommitizen } from './commitizen';
import { setupEslint } from './eslint';
import { setupGitIgnore } from './gitignore';
import { setupInit } from './init';
import { setupJest } from './jest';
import { setupMonorepo } from './monorepo';
import { Task } from './task';
import { setupTypescript } from './typescript';

type Tasks = {
  [name: string]: Task<any>;
};

const tasks = {
  ts: setupTypescript,
  eslint: setupEslint,
  esl: setupEslint,
  mono: setupMonorepo,
  init: setupInit,
  commitizen: setupCommitizen,
  cz: setupCommitizen,
  jest: setupJest,
  test: setupJest,
  gitignore: setupGitIgnore,
};

type TaskNames = keyof typeof tasks;

export type { Tasks, TaskNames };
export { tasks };
