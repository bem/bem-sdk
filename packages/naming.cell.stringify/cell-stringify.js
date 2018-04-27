'use strict';

const assert = require('assert');

const bemNaming = require('@bem/sdk.naming.entity');
const pathPatternParser = require('@bem/sdk.naming.cell.pattern-parser');

const buildPathStringifyMethod = (pattern, defaultLayer) => {
    const separation = pathPatternParser(pattern);

    return (cell) => {
        const res = [];
        const join = (parts, j) => {
            for (let i = 0; i < parts.length - j; i += 1) {
                const el = parts[i + j];
                if (i % 2 === 0) {
                    res.push(el);
                } else if (Array.isArray(el)) {
                    const k = el[0];
                    (k !== 'layer' || (cell[k] !== defaultLayer)) && cell[k] && join(el, 1);
                } else {
                    res.push(cell[el] || '');
                }
            }
        };

        join(separation, 0);
        return res.join('');
    };
};

/**
 * Stringifier generator
 *
 * @param {INamingConvention} conv - naming, path and scheme
 * @returns {function(BemCell): string} converts cell to file path
 */
module.exports = (conv) => {
    assert(typeof conv === 'object', '@bem/sdk.naming.cell.stringify: convention object required');

    assert(typeof Object(conv.fs).pattern === 'string',
        '@bem/sdk.naming.cell.stringify: fs.pattern field required in convention');

    const fsConv = conv.fs;

    const entityStringify = bemNaming(conv).stringify;

    const pathStringify = buildPathStringifyMethod(fsConv.pattern, fsConv.defaultLayer);
    const dd = fsConv.delims || {};
    const delims = Object(conv.delims);
    const dElem = 'elem' in dd ? dd.elem : (delims.elem || '__');
    const dMod = 'mod' in dd ? dd.mod : (Object(delims.mod).name || (typeof delims.mod === 'string' && delims.mod) || '_');

    const schemeStringify = fsConv.scheme !== 'nested' ?
        () => ''
        : e => `${e.block}/${e.elem?`${dElem}${e.elem}/`:''}${e.mod?`${dMod}${e.mod.name}/`:''}`;

    return (cell) => (assert(cell.tech, '@bem/sdk.naming.cell.stringify: ' +
            'tech field required for stringifying (' + cell.id + ')'),
        pathStringify({
            layer: cell.layer || 'common',
            tech: cell.tech,
            entity: schemeStringify(cell.entity) + entityStringify(cell.entity)
        }));
};
