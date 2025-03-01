import type { StandardSchemaV1 } from '@standard-schema/spec'

export class ValidationError extends Error {
  public issues: readonly StandardSchemaV1.Issue[]
  constructor(message: string, issues: readonly StandardSchemaV1.Issue[]) {
    super(message)
    this.issues = issues
  }
}

export async function validateSchema<T extends StandardSchemaV1>(
  schema: T,
  input: StandardSchemaV1.InferInput<T>,
): Promise<StandardSchemaV1.InferOutput<T>> {
  let result = schema['~standard'].validate(input)
  if (result instanceof Promise) result = await result

  // if the `issues` field exists, the validation failed
  if (result.issues) {
    throw new ValidationError('Validation failed', result.issues)
  }

  return result.value
}
