
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

function parse(importString, ctx) {
    const res = [],
        main = {};

    ctx || (ctx = {});

    importString.split(' ').forEach(importToken => {
        const split = importToken.split(':'),
            type = split[0],
            tail = split[1];

        switch(type) {
        case 'b':
            main.block = tail;
            res.push(main);
            break;

        case 'e':
            if(ctx.elem !== tail) {
                main.elem = tail;
                if(!main.block) {
                    main.block = ctx.block;
                    res.push(main);
                }
            }
            break;

        case 'm':
            const splitMod = tail.split('='),
                modName = splitMod[0],
                modVals = splitMod[1];

            main.elem || main.block || (main.elem = ctx.elem);
            main.block || (main.block = ctx.block);

            res.push(Object.assign({}, main, { mod : { name : modName } }));

            if(modVals) {
                modVals.split('|').forEach(modVal => {
                    res.push(Object.assign({}, main, { mod : { name : modName, val : modVal } }));
                });
            }
            break;
        }
    });

    return res;
}

module.exports = {
    parse
};
