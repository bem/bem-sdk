import {
  cellStringifyWrapper,
  type BemCellLike,
  type NamingConvention,
} from '@bem/sdk.naming.cell.stringify';

export type { NamingConvention } from '@bem/sdk.naming.cell.stringify';

export interface BemFileLike {
  cell: BemCellLike;
  level?: string;
  tech?: string;
  /** Used only for diagnostics. */
  id?: string;
}

export type FileStringify = (file: BemFileLike) => string;

/**
 * Creates a stringifier turning a `BemFile`-like object into a file path.
 *
 * Thin wrapper around `@bem/sdk.naming.cell.stringify`: prefixes the cell
 * path with `<level>/` when the file has a `level`.
 */
export function fileStringifyWrapper(conv: NamingConvention): FileStringify {
  if (!conv || typeof conv !== 'object') {
    throw new Error(
      '@bem/sdk.naming.file.stringify: convention object required',
    );
  }

  const stringifyCell = cellStringifyWrapper(conv);

  return (file) => {
    if (!file.tech && !file.cell?.tech) {
      throw new Error(
        `@bem/sdk.naming.file.stringify: tech field required for stringifying (${file.id ?? ''})`,
      );
    }
    const prefix = file.level ? `${file.level}/` : '';
    return prefix + stringifyCell(file.cell);
  };
}

export default fileStringifyWrapper;
