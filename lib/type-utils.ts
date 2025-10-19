/**
 * Advanced TypeScript utility types and helpers
 */

/**
 * Make specific properties of T optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make specific properties of T required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * Extract keys from T that are of type U
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

/**
 * Make properties readonly recursively
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * Make properties mutable
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

/**
 * Extract promise return type
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

/**
 * Async function return type
 */
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = UnwrapPromise<ReturnType<T>>

/**
 * Nullable type
 */
export type Nullable<T> = T | null

/**
 * Optional type
 */
export type Optional<T> = T | undefined

/**
 * Maybe type (null or undefined)
 */
export type Maybe<T> = T | null | undefined

/**
 * Non-nullable type (remove null and undefined)
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

/**
 * Async data state
 */
export type AsyncData<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E }

/**
 * Discriminated union helper
 */
export type DiscriminatedUnion<K extends string, T extends Record<K, string>> = {
  [P in T[K]]: { [Q in K]: P } & Omit<Extract<T, Record<K, P>>, K>
}[T[K]]

/**
 * Type-safe object keys
 */
export function typedKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

/**
 * Type-safe object entries
 */
export function typedEntries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}

/**
 * Assert value is not null/undefined
 */
export function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message || 'Value is null or undefined')
  }
}

/**
 * Type guard for non-nullable values
 */
export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Type guard for error objects
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error
}

/**
 * Type guard for objects
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Safe JSON parse with type
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Exhaustive check for discriminated unions
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}
