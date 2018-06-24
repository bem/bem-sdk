import { INamingConvention } from './types';
import { origin } from './origin';

export const legacy: INamingConvention = {
    ...origin,
    fs: {
        ...origin.fs,
        pattern: '${entity}${layer?@${layer}}.${tech}'
    }
};
