export interface SessionManager<T = unknown> {
  get: () => Promise<T | unknown | null>
  set: (itemValue: T) => Promise<void>
  destroy: () => Promise<void>
}
