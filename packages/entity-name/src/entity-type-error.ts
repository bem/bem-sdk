import { inspect } from 'node:util';

/**
 * Thrown when a value is not a valid BEM entity description.
 */
export class EntityTypeError extends Error {
  override name = 'EntityTypeError';

  /**
   * @param obj    The invalid value.
   * @param reason Optional human-readable reason.
   */
  constructor(obj?: unknown, reason?: string) {
    const str = inspect(obj, { depth: 1 });
    const type = obj === undefined || obj === null ? '' : typeof obj;
    const base = `the ${type} \`${str}\` is not valid BEM entity`;
    super(reason ? `${base}, ${reason}` : base);
  }
}
