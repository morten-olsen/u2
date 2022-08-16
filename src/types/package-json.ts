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
  repositry?: {
    type?: string;
    url?: string;
  };
}

export type { PackageJson };
