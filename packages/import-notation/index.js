const hashSet = require('hash-set');
const helpers = require('./lib/helpers');

const BemCellSet = hashSet(helpers.stringifyCell);

/**
 * Parse import statement and extract bem entities
 *
 * Example of parse:
 * ```js
 * var entity = parse('b:button e:text')[0];
 * entity.block // 'button'
 * entity.elem // 'text'
 * ```
 *
 * @public
 * @param {String} importString - string Literal from import statement
 * @param {BemEntity} [ctx] - entity to restore `block` part
 *                             it's needed for short syntax: `import 'e:elemOfThisBlock'`
 *                                                           `import 'm:modOfThisBlock`
 * @returns {BemCell[]}
 */
function parse(importString, ctx) {
    const cell = {};

    ctx && (importString = helpers.expand(importString, ctx));

    return Array.from(importString.split(' ').reduce((acc, importToken) => {
        const split = importToken.split(':'),
            type = split[0],
            tail = split[1];

        switch(type) {
        case 'b':
            cell.block = tail;
            acc.add(cell);
            break;

        case 'e':
            cell.elem = tail;
            break;

        case 'm': {
            const splitMod = tail.split('='),
                modName = splitMod[0],
                modVals = splitMod[1];

            acc.add(Object.assign({}, cell, { mod : { name : modName } }));

            modVals && modVals.split('|').forEach(modVal => {
                acc.add(Object.assign({}, cell, { mod : { name : modName, val : modVal } }));
            });
            break;
        }

        case 't':
            acc.forEach(e => {
                e.tech = tail;
            });
            break;
        }
        return acc;
    }, new BemCellSet()));
}

/**
 * Create import string notation of passed bem-cells.
 *
 * @example
 * ```js
 * stringify([{ block : 'button' }, { block : 'button', mod : { name : 'theme', val : 'normal' } }])
 * // 'b:button m:theme=normal'
 * ```
 * @public
 * @param {BemCell[]} cells - Set of BEM entities to merge into import string notation
 * @returns {String}
 */
function stringify(cells) {
    const merged = [].concat(cells).reduce((acc, cell) => {
        cell.block && (acc.block = cell.block);
        cell.elem && (acc.elem = cell.elem);
        cell.mod && (acc.mod[cell.mod.name] || (acc.mod[cell.mod.name] = []))
            && cell.mod.val && typeof cell.mod.val !== 'boolean'
            && !~acc.mod[cell.mod.name].indexOf(cell.mod.val)
            && acc.mod[cell.mod.name].push(cell.mod.val);
        cell.tech && (acc.tech = cell.tech);
        return acc;
    }, { mod : {} });

    return helpers.stringifyMergedCells(merged);
}

module.exports = {
    parse,
    stringify,
    expand : helpers.expand
};
