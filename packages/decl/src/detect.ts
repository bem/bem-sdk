/**
 * Detects bemdecl format by inspecting the structural shape.
 *
 * Heuristics:
 *  - `{ blocks: ... }`        -> v1
 *  - `{ deps: ... }`          -> enb
 *  - `{ decl: ... }` or array -> v2
 */
export function detect(obj: unknown): string | undefined {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Argument must be an object');
  }

  const o = obj as Record<string, unknown>;
  if (typeof o['blocks'] === 'object') return 'v1';
  if (typeof o['deps'] === 'object') return 'enb';
  if (typeof o['decl'] === 'object' || Array.isArray(obj)) return 'v2';
  return undefined;
}
