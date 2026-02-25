import assert from 'node:assert';

import createCellStringify from '@bem/sdk.naming.cell.stringify';

/**
 * Stringifier generator
 *
 * @param {INamingConvention} conv - naming, path and scheme
 * @returns {function(BemCell): string} converts cell to file path
 */
export default (conv) => {
    assert(typeof conv === 'object', '@bem/sdk.naming.file.stringify: convention object required');

    const stringify = createCellStringify(conv);

    return (file) => (assert(file.tech, '@bem/sdk.naming.file.stringify: ' +
            'tech field required for stringifying (' + file.id + ')'),
        (file.level ? file.level + '/' : '') + stringify(file.cell));
};
