import mergeWith from 'lodash.mergewith';

/**
 * Merge configs into the first argument. Arrays are treated as scalars
 * (replaced rather than merged element-wise).
 */
export function merge<T = Record<string, unknown>>(
  configs: T[] | T,
  ...rest: T[]
): T {
  const args: T[] = Array.isArray(configs) ? configs : [configs, ...rest];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- lodash.mergewith has loose typings
  const customizer = (objValue: unknown, srcValue: unknown): any => {
    if (Array.isArray(objValue)) return srcValue;
    return undefined;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mergeWith as unknown as (...a: any[]) => T)(...args, customizer);
}
