// Ambient declarations for untyped CJS dependencies used by config.
// Other deps (is-glob, lodash.mergewith, lodash.uniqwith) are typed via
// @types/* packages and don't need declarations here.

declare module 'betterc' {
  const betterc: unknown;
  export default betterc;
  export = betterc;
}
