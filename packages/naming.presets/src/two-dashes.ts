import { origin } from './origin.js';
import type { NamingConvention } from './types.js';

export const twoDashes: NamingConvention = {
  ...origin,
  delims: {
    elem: '__',
    mod: { name: '--', val: '_' },
  },
};
