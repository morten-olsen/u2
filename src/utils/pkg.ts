type PkgName = {
  scope?: string;
  name: string;
};

export const nameToString = (current: PkgName) => {
  if (!current.scope) {
    return current.name
  }
  return [current.scope, current.name].join('/');
}

export const parseName = (name: string): PkgName => {
  const [first, ...rest] = name.split('/');
  if (rest.length === 0) {
    return { name: first };
  }
  return { name: rest.join('/'), scope: first };
};

export const setScope = (current: PkgName | string, scope?: string) => {
  if (typeof current === 'string') {
    current = parseName(current);
  }
  current.scope = scope;
  return current;
};
