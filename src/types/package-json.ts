interface PackageJson {
  engines?: {
    [name: string]: string;
  };
  packageManager?: string;
  workspaces?: string[];
  devDependencies?: {
    [name: string]: string;
  };
  dependencies?: {
    [name: string]: string;
  };
};

export type { PackageJson };
