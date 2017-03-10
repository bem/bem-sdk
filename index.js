
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
    const main = {};
    ctx || (ctx = {});

    return importString.split(' ').reduce((acc, importToken) => {
        const split = importToken.split(':'),
            type = split[0],
            tail = split[1];

        if(type === 'b') {
            main.block = tail;
            acc.push(main);
        } else if(type === 'e') {
            main.elem = tail;
            if(!main.block && ctx.elem !== tail) {
                main.block = ctx.block;
                acc.push(main);
            }
        } else if(type === 'm' || type === 't') {
            if(!main.block) {
                main.block = ctx.block;
                main.elem || ctx.elem && (main.elem = ctx.elem);
            }

            if(type === 'm') {
                const splitMod = tail.split('='),
                    modName = splitMod[0],
                    modVals = splitMod[1];

                acc.push(Object.assign({}, main, { mod : { name : modName } }));

                modVals && modVals.split('|').forEach(modVal => {
                    acc.push(Object.assign({}, main, { mod : { name : modName, val : modVal } }));
                });
            } else {
                acc.length || acc.push(main);
                acc.forEach(e => e.tech = tail);
            }
        }
        return acc;
    }, []);
}

/**
 * Create import string notation of passed bem-cells.
 *
 * Example:
 * ```js
 * stringify([{ block : 'button' }, { block : 'button', mod : { name : 'theme', val : 'normal' } }])
 * // 'b:button m:theme=normal'
 * ```
 * @public
 * @param {BemCell[]} - Set of BEM entites to merge into import string notation
 * @returns {String}
 */
function stringify(cells) {
    const merged = [].concat(cells).reduce((acc, cell) => {
        cell.block && (acc.b = cell.block);
        cell.elem && (acc.e = cell.elem);
        cell.mod && (acc.m[cell.mod.name] || (acc.m[cell.mod.name] = []))
            && cell.mod.val && acc.m[cell.mod.name].push(cell.mod.val);
        cell.tech && (acc.t = cell.tech);
        return acc;
    }, { m : {} });

    return ['b', 'e', 'm', 't'].map(k => tmpl[k](merged[k])).join('');
}

const tmpl = {
    b : b => `b:${b}`,
    e : e => e ? ` e:${e}` : '',
    m : m => Object.keys(m).map(name => `${tmpl.mn(name)}${tmpl.mv(m[name])}`).join(''),
    mn : m => ` m:${m}`,
    mv : v => v.length ? `=${v.join('|')}` : '',
    t : t => t ? ` t:${t}` : ''
};

module.exports = {
    parse,
    stringify
};
