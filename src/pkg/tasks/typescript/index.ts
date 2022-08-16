import { Task } from '../task';
import { join, relative } from 'path';

const setupTypescript: Task<any> = {
  name: 'typescript',
  run: async ({ project, getCurrent, isRoot }) => {
    const { root, isMonoRepo } = project;
    const current = getCurrent();
    await root.addDevDependency({ name: 'typescript' });
    {
      const tsConfig = root.getFile('tsconfig.json').json;
      if (!tsConfig.file.exists) {
        tsConfig.content = {
          compilerOptions: {
            target: 'es2016',
            module: 'commonjs',
            forceConsistentCasingInFileNames: true,
            strict: true,
            declaration: true,
            sourceMap: true,
            outDir: './dist',
            esModuleInterop: true,
            skipLibCheck: true,
          },
        };
      }
      if (isMonoRepo) {
        tsConfig.content.include = [];
        tsConfig.content.references = tsConfig.content.references || [];
      } else {
        tsConfig.content.include = ['./src/**/*.ts'];
      }
    }

    if (!isRoot) {
      const tsConfig = current.getFile('tsconfig.json').json;
      tsConfig.content = {
        extends: relative(
          join(current.location, 'tsconfig.json'),
          join(root.location, 'tsconfig.json')
        ),
        compilerOptions: {
          outDir: './dist',
        },
        include: ['./src'],
      };
      const rootTsConfig = root.getFile('tsconfig.json').json;
      const pathLocation = relative(root.location, current.location);
      const currentReference = rootTsConfig.content.references.find(
        (r: any) => r.path === pathLocation
      );
      if (!currentReference) {
        rootTsConfig.content.references.push({
          path: pathLocation,
        });
      }
    }
  },
};

export { setupTypescript };
