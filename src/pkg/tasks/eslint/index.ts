import { Task } from '../task';

const setupEslint: Task<any> = {
  name: 'eslint',
  run: async ({ project }) => {
    const { root } = project;
    await root.addDevDependency({ name: 'eslint' });
    await root.addDevDependency({ name: 'prettier' });
    await root.addDevDependency({
      name: '@react-native-community/eslint-config',
    });
    const eslintrc = root.getFile('eslintrc.json').json;
    eslintrc.content = {
      extends: '@react-native-community',
      rules: {
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
          },
        ],
      },
    };
  },
};

export { setupEslint };
