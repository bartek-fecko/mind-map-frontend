export function exclude<T extends object, Key extends keyof T>(obj: T, ...keys: Key[]): Omit<T, Key> {
  const copy = { ...obj };
  for (const key of keys) {
    delete copy[key];
  }
  return copy;
}
