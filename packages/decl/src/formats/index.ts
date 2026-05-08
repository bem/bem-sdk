import * as v1 from './v1/index.js';
import * as v2 from './v2/index.js';
import * as enb from './enb/index.js';
import * as harmony from './harmony/index.js';

const isNotSupported = (): never => {
  throw new Error(
    "This format isn't supported yet, file an issue: https://github.com/bem/bem-sdk/issues/new?labels=pkg:decl",
  );
};

export interface FormatBundle {
  format: (...args: unknown[]) => unknown;
  parse: (...args: unknown[]) => unknown;
}

const baseFormat: FormatBundle = {
  format: isNotSupported,
  parse: isNotSupported,
};

export const formats: Record<string, FormatBundle> = {
  v1: { ...baseFormat, ...v1 } as FormatBundle,
  v2: { ...baseFormat, ...v2 } as FormatBundle,
  enb: { ...baseFormat, ...enb } as FormatBundle,
  harmony: { ...baseFormat, ...(harmony as Partial<FormatBundle>) } as FormatBundle,
};

export default formats;
