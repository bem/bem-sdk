/**
 * Helpers to test import-notation first part
 */
const tests = {
    /**
     * Returns true if notation starts with block-part
     *
     * Example:
     * ```js
     * b('b:button e:icon') // true
     * b('e:icon') // false
     * ```
     *
     * @param {String} n - notation
     *
     * @returns {Boolean}
     */
    b : n => /^b:/.test(n),

    /**
     * Returns true if notation starts with element-part
     *
     * Example:
     * ```js
     * b('b:button e:icon') // false
     * b('e:icon') // true
     * ```
     *
     * @param {String} n - notation
     *
     * @returns {Boolean}
     */
    e : n => /^e:/.test(n)
};

/**
 * Helpers to build parts of import-notation.
 * All parts concatenated by '' gives full import-notation string
 */
const templates = {
    /**
     * Returns block-part of notation
     *
     * Example:
     * ```js
     * b('button') // 'b:button'
     * ```
     *
     * @param {String} b - name of block
     *
     * @returns {String}
     */
    b : b => `b:${b}`,

    /**
     * Returns element-part of notation
     *
     * Example:
     * ```js
     * e('icon') // ' e:icon'
     * ```
     *
     * @param {String} e - name of element
     *
     * @returns {String}
     */
    e : e => e ? ` e:${e}` : '',

    /**
     * Returns modifiers-part of notation
     *
     * Example:
     * ```js
     * m({ color: ['red', 'yellow'], theme: ['default'] })
     * // ' m:color=red|yellow m:theme=default'
     * ```
     *
     * @param {Object<String[]>} m - modifiers with values in arrays
     *
     * @returns {String}
     */
    m : m => Object.keys(m).map(name => `${templates._mn(name)}${templates._mv(m[name])}`).join(''),

    /**
     * Returns modifier-name-part of notation
     *
     * Example:
     * ```js
     * _mn('color') // ' m:color'
     * ```
     *
     * @param {String} mn - name of modifier
     *
     * @returns {String}
     */
    _mn : mn => ` m:${mn}`,

    /**
     * Returns modifier-values-part of notation
     *
     * Example:
     * ```js
     * _mv(['red', 'yellow']) // '=red|yellow'
     * ```
     *
     * @param {String[]} mv - modifier values in array
     *
     * @returns {String}
     */
    _mv : mv => mv.length ? `=${mv.join('|')}` : '',

    /**
     * Returns technology-part of notation
     *
     * Example:
     * ```js
     * t('js') // ' t:js'
     * ```
     *
     * @param {String[]} t - name of technology
     *
     * @returns {String}
     */
    t : t => t ? ` t:${t}` : ''
};

/**
 * BemCell variant of templates
 */
const cellTemplates = Object.assign({}, templates, {
    /**
     * Returns modifiers-part of notation
     *
     * Example:
     * ```js
     * m({ name: 'theme', val: 'default' }) // ' m:theme=default'
     * ```
     *
     * @param {{ name: String, val: String }} m - modifier with single value
     *
     * @returns {String}
     */
    m : m => m ? ` m:${m.name}=${m.val}` : ''
});

/**
 * Returns import-notation stringify method for set of templates
 *
 * @param {Object} ts - helpers to build parts of import-notation
 *
 * @returns {String}
 */
const stringifyMethod = ts => x => ['block', 'elem', 'mod', 'tech'].map(k => ts[k[0]](x[k])).join('');

/**
 * Returns import-notation filled up by context entity
 *
 * @param {String} n - notation
 * @param {BemEntity} scope - context entity
 *
 * @returns {String}
 */
const fillup = (n, scope) => {
    if(tests.b(n)) {
        return n;
    }

    return templates.b(scope.block) +
        (tests.e(n) ? '' : templates.e(scope.elem)) + ' ' + n;
};

module.exports = {
    fillup,
    stringifyMergedCells : stringifyMethod(templates),
    stringifyCell : stringifyMethod(cellTemplates)
};
