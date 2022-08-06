import { Task } from '../task';

const setupJest: Task<any> = {
  name: 'jest',
  run: async ({ project }) => {
    const { root } = project;
    await root.addDevDependency({ name: 'jest' });
    if (root.getFile('tsconfig.json').exists) {
      await root.addDevDependency({ name: 'ts-jest' });
      await root.addDevDependency({ name: '@types/jest' });
    }
    const jestConifg = root.getFile('jest.config.js');
    if (!jestConifg.exists) {
      jestConifg.content = `
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
      `;
    }
  },
};

export { setupJest };
