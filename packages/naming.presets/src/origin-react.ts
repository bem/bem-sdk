import { origin } from './origin.js';
import type { NamingConvention } from './types.js';

export const originReact: NamingConvention = {
  ...origin,
  delims: {
    ...origin.delims,
    elem: '-',
  },
  fs: {
    ...origin.fs,
    delims: { elem: '' },
  },
  wordPattern: '[a-zA-Z0-9]+',
};
