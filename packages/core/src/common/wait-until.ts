import { Context } from '../context/context'

export interface WaitUntil {
  (promise: Promise<any>): void
}

export async function waitUntilMock(promise: Promise<any>): Promise<void> {
  try {
    await promise
  } catch (error) {
    const { logger } = Context
    logger.error('Mocked wait until promise failed', { error })
    // noop
  }
}
