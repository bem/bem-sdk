
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
 * @property {String} importString - string Literal from import statement
 * @property {BemEntity} [ctx] - entity to restore `block` part
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

        switch(type) {
        case 'b':
            main.block = tail;
            acc.push(main);
            break;

        case 'e':
            if(ctx.elem !== tail) {
                main.elem = tail;
                if(!main.block) {
                    main.block = ctx.block;
                    acc.push(main);
                }
            }
            break;

        case 'm':
            const splitMod = tail.split('='),
                modName = splitMod[0],
                modVals = splitMod[1];

            main.elem || main.block || (main.elem = ctx.elem);
            main.block || (main.block = ctx.block);

            acc.push(Object.assign({}, main, { mod : { name : modName } }));

            modVals && modVals.split('|').forEach(modVal => {
                acc.push(Object.assign({}, main, { mod : { name : modName, val : modVal } }));
            });
            break;

        case 't':
            acc = acc.map(e => {
                e.tech = tail;
                return e;
            });
            break;
        }

        return acc;
    }, []);
}

module.exports = {
    parse
};
