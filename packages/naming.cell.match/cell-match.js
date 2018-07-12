'use strict';

const assert = require('assert');

const BemCell = require('@bem/sdk.cell');
const bemNamingParse = require('@bem/sdk.naming.entity.parse');
const pathPatternParser = require('@bem/sdk.naming.cell.pattern-parser');

const ALPHANUM_RE = '[A-Za-z][\\w\\-]*';
const resc = s => String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');

const SCHEMES = {
    flat: () => [
        `(?:()(${ALPHANUM_RE})`,
        ')?',
        () => true // No way to check trash files in root. They all are just fine.
    ],
    mixed: ({ wp }) => [
        `(?:(${wp})(?:/(${ALPHANUM_RE})`,
        ')?)?',
        (entity, { dir }) => (entity.block === dir)
    ],
    nested: ({ wp, delims: { elem, mod } }) => [
        // Opener generator
        `(?:(${wp}(?:/${elem}${wp})?(?:/${mod}${wp})?)(?:/(${ALPHANUM_RE})`,
        // Closer generator
        ')?)?',
        // Validator
        (entity, { dir }) => {
            const parts = dir.split('/');
            let i = 1;
            return entity.block === parts[0] &&
                (!entity.elem || (parts[i++] === elem + entity.elem)) &&
                (!entity.mod || (parts[i++] == mod + entity.mod.name));
        }
    ]
};

const preparePattern_ = ({
    fs: {
        pattern,
        delims: fsDelims = {},
        scheme = 'nested'
    },
    delims,
    wordPattern = ALPHANUM_RE
}) => {
    assert(SCHEMES[scheme], 'fs.scheme should be "nested", "mixed" or "flat".');

    const patternTree = pathPatternParser(pattern);

    const dd = fsDelims;
    const [ entityReStart, entityReEnd, isValid ] = SCHEMES[scheme]({
        wp: wordPattern,
        delims: {
            elem: 'elem' in dd ? dd.elem : (delims.elem || '__'),
            mod: 'mod' in dd
                ? dd.mod
                : (Object(delims.mod).name || (typeof delims.mod === 'string' && delims.mod) || '_')
        }
    });

    let regexpChunks = [];
    const keys = [];
    const res = [];
    const diveIntoPattern_ = (parts, j) => {
        for (let i = 0; i < parts.length - j; i += 1) {
            const el = parts[i + j];
            if (i % 2 === 0) {
                const subParts = el.split('/');
                res.push(subParts.map(part => resc(part)).join('(?:/'));
                [].unshift.apply(regexpChunks, Array.from(new Array(subParts.length - 1)).map(() => ')?'));
            } else if (Array.isArray(el)) {
                res.push('(?:');
                diveIntoPattern_(el, 1);
                res.push(')?');
            } else if (el === 'entity') {
                keys.push('dir', el);
                res.push(entityReStart);
                regexpChunks.unshift(entityReEnd);
            } else {
                keys.push(el);
                res.push(el === 'tech' ? `(${wordPattern}(?:\\.(?:${wordPattern})+)*)` : `(${wordPattern})`);
            }
        }
    };
    diveIntoPattern_(patternTree, 0);

    const regexp = new RegExp('^' + res.concat(regexpChunks).join('') + '(.*)$');
    keys.push('rest');

    return { regexp, keys, isValid };
};

function buildPathParseMethod(conv) {
    const entityParse = bemNamingParse(conv);
    const { regexp, keys, isValid } = preparePattern_(conv);

    /**
     * Generates parse function
     *
     * @param {string} relPath — relative path to file
     * @return {{layer: ?string, entity: ?BemEntityName, tech: ?string, rest: ?string}} — path parsed to chunks
     */
    return (relPath) => {
        const res = relPath.match(regexp);

        if (!res) {
            return null;
        }

        const obj = keys.reduce((r, key, i) => {
            if (res[i+1] !== undefined) {
                r[key] = res[i+1];
            }
            return r;
        }, {});

        if (!obj.entity && obj.rest) {
            return null;
        }

        const entity = obj.entity && entityParse(obj.entity);
        if (entity && !isValid(entity, obj)) {
            return null;
        }

        obj.entity = entity;
        return obj;
    }
}

/**
 * Stringifier generator
 *
 * @param {BemNamingConvention} conv - naming, path and scheme
 * @returns {function(string): {cell: ?BemCell, isMatch: boolean, rest: ?string}} converts cell to file path
 */
module.exports = (conv = {}) => {
    assert(conv.fs && typeof conv.fs.pattern === 'string',
        '@bem/sdk.naming.cell.match: fs.pattern field required in convention');

    const layer = conv.fs.defaultLayer || 'common';
    let parse = buildPathParseMethod(conv);

    // Special crunch for nested scheme and empty elem
    if (conv.fs.delims && conv.fs.delims.elem === '') {
        const parse1 = parse;
        const parse2 = buildPathParseMethod({ ...conv, fs: { ...conv.fs, delims: { ...conv.fs.delims, elem: '💩' } } });
        parse = (relPath) => parse1(relPath) || parse2(relPath);
    }

    return (relPath) => {
        const parsed = parse(relPath);
        const res = { cell: null, isMatch: false, rest: null };
        if (!parsed) {
            return res;
        }

        if (parsed.entity) {
            res.cell = BemCell.create({
                layer: parsed.layer || layer,
                tech: parsed.tech,
                entity: parsed.entity
            });
        }

        res.isMatch = !parsed.rest;
        res.rest = parsed.rest || null;

        return res;
    };
};
