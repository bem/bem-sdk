// Ambient declarations for untyped CJS dependencies used by config.

declare module 'betterc' {
  const betterc: unknown;
  export default betterc;
  export = betterc;
}

declare module 'is-glob' {
  function isGlob(value: string): boolean;
  export default isGlob;
  export = isGlob;
}

declare module 'lodash.mergewith' {
  function mergeWith<T, S, R = T & S>(
    object: T,
    source: S,
    customizer?: (objValue: unknown, srcValue: unknown) => unknown,
  ): R;
  export default mergeWith;
  export = mergeWith;
}

declare module 'lodash.uniqwith' {
  function uniqWith<T>(arr: T[], comparator: (a: T, b: T) => boolean): T[];
  export default uniqWith;
  export = uniqWith;
}
