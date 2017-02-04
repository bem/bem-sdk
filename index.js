
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
 * Example of parseImport:
 * ```js
 * var entity = parseImport('b:button e:text')[0];
 * entity.block // 'button'
 * entity.text // 'text'
 * ```
 *
 * @public
 * @property {String} importString - string Literal from import statement
 * @property {BemEntity} [ctx] - entity to restore `block` part
 *                             it's needed for short syntax: `import 'e:elemOfThisBlock'`
 *                                                           `import 'm:modOfThisBlock`
 * @returns {BemCell[]}
 */
function parseImport(importString, ctx) {
    const res = [],
        main = {};

    ctx || (ctx = {});

    importString.split(' ').forEach((importToken, i) => {
        const split = importToken.split(':'),
            type = split[0],
            tail = split[1];

        if(!i) {
            main.block = type === 'b'? tail : ctx.block;
            type === 'e' && (main.elem = tail);
        } else if(type === 'e') {
            main.elem = tail;
        }

        switch(type) {
            case 'b':
            case 'e':
                res.length || res.push(main);
            break;

            case 'm':
                const splitMod = tail.split('='),
                    modName = splitMod[0],
                    modVals = splitMod[1];

                if(main.block === ctx.block) {
                    main.elem || (main.elem = ctx.elem);
                }

                if(modVals) {
                    modVals.split('|').forEach(modVal => {
                        res.push(Object.assign({}, main, {mod: {name: modName, val: modVal}}));
                    });
                } else {
                    res.push(Object.assign({}, main, {mod: {name: modName}}));
                }
            break;
        }
    });

    return res;
}

module.exports = parseImport;
