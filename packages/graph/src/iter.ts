/**
 * Concatenates several iterables into a single one.
 *
 * Replaces `require('ho-iter').series(...)` — produces a fresh iterator each
 * time it is iterated, in line with native iterator semantics.
 */
export function* series<T>(...iterables: Iterable<T>[]): Iterable<T> {
  for (const it of iterables) {
    if (!it) continue;
    yield* it;
  }
}
