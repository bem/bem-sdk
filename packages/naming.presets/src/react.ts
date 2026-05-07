import { originReact } from './origin-react.js';
import type { NamingConvention } from './types.js';

export const react: NamingConvention = {
  ...originReact,
  fs: {
    ...originReact.fs,
    pattern: '${entity}${layer?@${layer}}.${tech}',
  },
};
