// Ambient declarations for untyped CJS dependencies used by keyset.

declare module 'node-eval' {
  function nEval(src: string, filename?: string, scope?: Record<string, unknown>): unknown;
  export default nEval;
  export = nEval;
}

declare module 'xamel' {
  // The library is callback-based; we wrap it in `src/xamel.ts`. Mark as
  // unknown — the wrapper module casts to a typed shape.
  const xamel: unknown;
  export default xamel;
  export = xamel;
}
