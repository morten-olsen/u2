import { existsSync, writeFile } from 'fs-extra';

export const jsonFileProxy = async <T>(filePath: string, fallback: T) => {
  let next: undefined | (() => Promise<void>);
  let running = false;

  const current = existsSync(filePath) ? await import(filePath) : fallback;

  const run = async () => {
    if (running) {
      return;
    }
    running = true;
    while (next) {
      const task = next;
      next = undefined;
      await task();
    }
    running = false;
  };

  const proxy = jsonProxy(current, () => {
    next = async () => {
      await writeFile(filePath, JSON.stringify(proxy.current, null, 2));
    };
    run();
  });

  return proxy;
};

export const jsonProxy = <T>(target: T, change: () => void): T => {
  const createProxy = (target: any): any =>
    new Proxy(target, {
      get: (proxyTarget: any, key: string) => {
        if (typeof proxyTarget[key] === 'object') {
          return createProxy(proxyTarget[key]);
        }
        return proxyTarget[key];
      },
      set: (proxyTarget: any, key: string, value: any) => {
        proxyTarget[key] = value;
        change();
        return true;
      },
    });
  return createProxy(target) as T;
};
