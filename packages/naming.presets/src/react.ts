import { INamingConvention } from './types';
import { originReact } from './origin-react';

export const react: INamingConvention = {
    ...originReact,
    fs: {
        ...originReact.fs,
        pattern: '${entity}${layer?@${layer}}.${tech}'
    }
};
