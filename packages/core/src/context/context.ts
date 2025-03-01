import type { Cache as CachifiedCache } from '@epic-web/cachified'
import { AsyncLocalStorage } from 'node:async_hooks'
import { DefaultLogger } from '../common/default-logger'
import { invariant } from '../common/invariant'
import type { Logger } from '../common/logger-interface'
import type { WaitUntil } from '../common/wait-until'
import { waitUntilMock } from '../common/wait-until'
import type { Database } from '../database/database-types'
import type { DemoObject, SqliteDurableObject } from '../durable-objects'
import { createDurableObjectProxy, type DurableObjectProxy } from './durable-object-helpers'

interface Context {
  logger: Logger
  cache: CachifiedCache
  db: Database
  request: Request
  waitUntil: WaitUntil
  durableObjects: {
    demo: DurableObjectNamespace<DemoObject>
  }
  durableObjectProxies: {
    demo: DurableObjectProxy<DemoObject>
  }
}

export const ContextAsyncLocalStorage = new AsyncLocalStorage<Context>()

export const Context: Context = {
  get cache() {
    const cache = ContextAsyncLocalStorage.getStore()?.cache
    invariant(cache, 'Cache not found in app context')
    return cache
  },
  get logger() {
    const logger = ContextAsyncLocalStorage.getStore()?.logger
    return logger ?? new DefaultLogger()
  },
  get waitUntil() {
    const waitUntil = ContextAsyncLocalStorage.getStore()?.waitUntil
    return waitUntil ?? waitUntilMock
  },
  get db() {
    const db = ContextAsyncLocalStorage.getStore()?.db
    invariant(db, 'Database not found in app context')
    return db
  },
  get request() {
    const request = ContextAsyncLocalStorage.getStore()?.request
    invariant(request, 'Request not found in app context')
    return request
  },
  get durableObjectProxies() {
    const durableObjects = ContextAsyncLocalStorage.getStore()?.durableObjects
    invariant(durableObjects, 'Durable Object namespace not found in app context')
    return {
      demo: createDurableObjectProxy<DemoObject, DemoObject>(durableObjects.demo),
    }
  },
  get durableObjects() {
    const durableObjects = ContextAsyncLocalStorage.getStore()?.durableObjects
    invariant(durableObjects, 'Durable Object namespace not found in app context')
    return durableObjects
  },
  //   const DO_sqliteDurableObject = ContextAsyncLocalStorage.getStore()?.DO_sqliteDurableObject
  //   invariant(DO_sqliteDurableObject, 'Durable Object namespace not found in app context')

  //   return {
  //     get: async (
  //       id: DurableObjectId,
  //       options?: DurableObjectNamespaceGetDurableObjectOptions,
  //     ): Promise<DurableObjectStub<SqliteDurableObject>> => {
  //       const DO = await DO_sqliteDurableObject.get(id, options)
  //       await DO.migrate()
  //       return DO
  //     },
  //     idFromName: DO_sqliteDurableObject.idFromName,
  //     idFromString: DO_sqliteDurableObject.idFromString,
  //     jurisdiction: DO_sqliteDurableObject.jurisdiction,
  //     newUniqueId: DO_sqliteDurableObject.newUniqueId,
  //   }
  // },
}
