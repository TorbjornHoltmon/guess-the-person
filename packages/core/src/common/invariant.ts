export class InvariantError extends Error {}

export function invariant(condition: any, msg: string): asserts condition {
  if (!condition) {
    const error = `Invariant failed: ${msg}`
    throw new InvariantError(error)
  }
}
