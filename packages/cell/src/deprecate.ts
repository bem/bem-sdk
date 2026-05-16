const NAMESPACE = '@bem/sdk.cell';
const seen = new Set<string>();

function isSilenced(): boolean {
  const flag = process.env['NO_DEPRECATION'];
  if (!flag) return false;
  if (flag === '*') return true;
  return flag.split(/[ ,]+/).includes(NAMESPACE);
}

/**
 * Emits a deprecation notice once per unique message.
 * Replaces legacy `depd('@bem/sdk.cell')`.
 */
export function emitDeprecation(message: string): void {
  if (seen.has(message)) return;
  seen.add(message);

  const fullMessage = `${NAMESPACE} deprecated ${message}`;

  const err = new Error(fullMessage);
  err.name = 'DeprecationError';
  (process as unknown as { emit: (ev: string, ...args: unknown[]) => boolean })
    .emit('deprecation', err);

  if (!isSilenced()) {
    process.stderr.write(`${fullMessage}\n`);
  }
}
