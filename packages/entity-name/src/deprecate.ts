import { inspect } from 'node:util';

const NAMESPACE = '@bem/sdk.entity-name';
const seen = new Set<string>();

function isSilenced(): boolean {
  const flag = process.env['NO_DEPRECATION'];
  if (!flag) return false;
  if (flag === '*') return true;
  return flag.split(/[ ,]+/).includes(NAMESPACE);
}

/**
 * Emits a deprecation notice once per unique message.
 *
 * Replaces legacy `depd('@bem/sdk.entity-name')` from the CommonJS build:
 *  - prints to `stderr` (unless `NO_DEPRECATION` mutes it)
 *  - emits `process.emit('deprecation', err)` so tests can subscribe
 */
export function emitDeprecation(message: string): void {
  if (seen.has(message)) return;
  seen.add(message);

  const fullMessage = `${NAMESPACE} deprecated ${message}`;

  // Best-effort `process.emit('deprecation', err)` for compatibility with the
  // legacy `depd` listener pattern used by tests.
  const err = new Error(fullMessage);
  err.name = 'DeprecationError';
  // `process.emit` accepts `unknown` payload; cast keeps types tight here.
  (process as unknown as { emit: (ev: string, ...args: unknown[]) => boolean })
    .emit('deprecation', err);

  if (!isSilenced()) {
    process.stderr.write(`${fullMessage}\n`);
  }
}

/**
 * Logs a deprecation message about a legacy field on an entity-like object.
 */
export function deprecate(obj: unknown, deprecateName: string, newName: string): void {
  const objStr = inspect(obj, { depth: 1 });
  const message = [
    `\`${deprecateName}\` is kept just for compatibility and can be dropped in the future.`,
    `Use \`${newName}\` instead in \`${objStr}\` at`,
  ].join(' ');

  emitDeprecation(message);
}

/** Test-only helper to reset the dedup cache between specs. */
export function _resetDeprecationCacheForTests(): void {
  seen.clear();
}
