import { INamingConvention } from './types';

export const twoDashes: INamingConvention = {
    delims: {
        elem: '__',
        mod: { name: '--', val: '_' }
    },
    fs: {
        // delims: { elem: '__', mod: '--' }, // redundand because of defaults
        pattern: '${layer}.blocks/${entity}.${tech}',
        scheme: 'nested'
    },
    wordPattern: '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*'
};
