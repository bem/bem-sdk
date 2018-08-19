import { INamingConvention } from './types';
import { origin } from './origin';

export const originReact: INamingConvention = {
    ...origin,
    delims: {
        ...origin.delims,
        elem: '-'
    },
    fs: {
        ...origin.fs,
        delims: { elem: '' }
    },
    wordPattern: '[a-zA-Z0-9]+'
};
