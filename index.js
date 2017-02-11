
/**
 * Parse import statement and extract bem entities
 *
 * @example
 * Example of import statements:
 * ```js
 * import 'b:button';
 * import 'b:button e:text';
 * import 'e:control e:text';
 * import 'b:button t:css';
 * import 'b:popup m:autoclosable';
 * import 'm:theme=normal|action m:size=xs|s|m|l';
 * ```
 * Check https://github.com/bem/bem-react-core for full docs.
 *
 * Example of parse:
 * ```js
 * var entity = parse('b:button e:text')[0];
 * entity.block // 'button'
 * entity.text // 'text'
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
            if(ctx.elem !== tail) {
                main.elem = tail;
                if(!main.block) {
                    main.block = ctx.block;
                    acc.push(main);
                }
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

module.exports = {
    parse
};
