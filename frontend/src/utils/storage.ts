const PREFIX = 'auditex:';

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(`${PREFIX}${key}`);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  },
  remove(key: string) {
    localStorage.removeItem(`${PREFIX}${key}`);
  },
};
