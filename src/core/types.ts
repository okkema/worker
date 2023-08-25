/**
 * Make keys of type optional
 */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>
/**
 * Make keys of type required
 */
export type MakeRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>
