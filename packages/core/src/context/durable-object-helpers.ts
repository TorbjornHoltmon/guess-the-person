import type { DurableObjectNamespaceGetDurableObjectOptions } from '@cloudflare/workers-types/2023-07-01'

type TypedDurableObject<OBJECT extends {}, STUB extends Rpc.DurableObjectBranded | undefined = undefined> = OBJECT &
  DurableObjectStub<STUB>

export interface DurableObjectProxy<
  DO extends {},
  DONamespace extends Rpc.DurableObjectBranded | undefined = undefined,
> {
  get(id: string, options?: DurableObjectNamespaceGetDurableObjectOptions): TypedDurableObject<DO, DONamespace>
  createFromUniqueId(options?: DurableObjectNamespaceGetDurableObjectOptions): {
    object: TypedDurableObject<DO, DONamespace>
    id: string
  }
  createFromUniqueIdInjurisdiction(jurisdiction: DurableObjectJurisdiction): {
    object: TypedDurableObject<DO, DONamespace>
    id: string
  }
  getFromJurisdiction(id: string, jurisdiction: DurableObjectJurisdiction): TypedDurableObject<DO, DONamespace>
}

export function createDurableObjectProxy<
  DO extends {},
  DONamespace extends Rpc.DurableObjectBranded | undefined = undefined,
>(DO: DurableObjectNamespace<DONamespace>): DurableObjectProxy<TypedDurableObject<DO>> {
  return {
    get: (id, options) => {
      const durableObjectId = DO.idFromName(id)
      const durableObject = DO.get(durableObjectId, options)

      return durableObject as TypedDurableObject<DO>
    },
    createFromUniqueId: (options) => {
      const durableObjectId = DO.newUniqueId()
      const durableObject = DO.get(durableObjectId, options)
      return {
        object: durableObject as TypedDurableObject<DO>,
        id: durableObjectId.name!,
      }
    },
    createFromUniqueIdInjurisdiction: (jurisdiction) => {
      const durableObjectId = DO.newUniqueId({ jurisdiction })
      const durableObject = DO.get(durableObjectId)
      return {
        object: durableObject as TypedDurableObject<DO>,
        id: durableObjectId.name!,
      }
    },
    getFromJurisdiction: (id, jurisdiction) => {
      const durableObjectJurisdiction = DO.jurisdiction(jurisdiction)
      const durableObjectId = durableObjectJurisdiction.idFromString(id)
      const durableObject = DO.get(durableObjectId)
      return durableObject as TypedDurableObject<DO>
    },
  }
}

interface SQLiteDurableObjectProxy<
  DO extends {},
  DONamespace extends ({ migrate: Promise<void> } & Rpc.DurableObjectBranded) | undefined = undefined,
> {
  get(id: string, options?: DurableObjectNamespaceGetDurableObjectOptions): Promise<TypedDurableObject<DO, DONamespace>>
  createFromUniqueId(options?: DurableObjectNamespaceGetDurableObjectOptions): Promise<{
    object: TypedDurableObject<DO, DONamespace>
    id: string
  }>
  createFromUniqueIdInjurisdiction(jurisdiction: DurableObjectJurisdiction): Promise<{
    object: TypedDurableObject<DO, DONamespace>
    id: string
  }>
  getFromJurisdiction(id: string, jurisdiction: DurableObjectJurisdiction): Promise<TypedDurableObject<DO, DONamespace>>
}

export function createSQLiteDurableObjectProxy<
  DO extends {},
  DONamespace extends Rpc.DurableObjectBranded | undefined = undefined,
>(DO: DurableObjectNamespace<DONamespace>): SQLiteDurableObjectProxy<TypedDurableObject<DO>> {
  return {
    get: async (id, options) => {
      const durableObjectId = DO.idFromName(id)
      const durableObject = DO.get(durableObjectId, options)
      await durableObject.migrate()

      return durableObject as TypedDurableObject<DO>
    },
    createFromUniqueId: async (options) => {
      const durableObjectId = DO.newUniqueId()
      const durableObject = DO.get(durableObjectId, options)
      return {
        object: durableObject as TypedDurableObject<DO>,
        id: durableObjectId.name!,
      }
    },
    createFromUniqueIdInjurisdiction: async (jurisdiction) => {
      const durableObjectId = DO.newUniqueId({ jurisdiction })
      const durableObject = DO.get(durableObjectId)
      return {
        object: durableObject as TypedDurableObject<DO>,
        id: durableObjectId.name!,
      }
    },
    getFromJurisdiction: async (id, jurisdiction) => {
      const durableObjectJurisdiction = DO.jurisdiction(jurisdiction)
      const durableObjectId = durableObjectJurisdiction.idFromString(id)
      const durableObject = DO.get(durableObjectId)
      return durableObject as TypedDurableObject<DO>
    },
  }
}
