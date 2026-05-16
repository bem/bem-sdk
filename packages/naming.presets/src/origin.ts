import type { NamingConvention } from './types.js';

export const origin: NamingConvention = {
  delims: {
    elem: '__',
    mod: { name: '_', val: '_' },
  },
  fs: {
    pattern: '${layer?${layer}.}blocks/${entity}.${tech}',
    scheme: 'nested',
  },
  wordPattern: '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*',
};
