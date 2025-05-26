// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface QueueOfflineEvent<T = any> {
  type: string;
  payload?: Record<string, unknown>;
  callback?: (...args: T[]) => void;
}
