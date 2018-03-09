/**
 * @type {ImportNotationTemplates}
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
 * Helpers for BemCell
 *
 * @type {ImportNotationTemplates}
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
    m : m => m ? `${templates._mn(m['name'])}${templates._mv([m['val']])}` : ''
});

/**
 * Returns import-notation stringify for set of templates
 *
 * @param {ImportNotationTemplates} ts - set of templates to build parts of import-notation
 *
 * @returns {String}
 */
const stringifyBuilder = ts => x => ['block', 'elem', 'mod', 'tech'].map(k => ts[k[0]](x[k])).join('');

module.exports = {
    stringifyMergedCells : stringifyBuilder(templates),
    stringifyCell : stringifyBuilder(cellTemplates)
};

/**
 * Helpers to build parts of import-notation. All parts concatenated by '' gives import-notation string
 *
 * @typedef {Object} ImportNotationTemplates
 *
 * @property {Function} b - returns block-part of notation
 * @property {Function} e - returns element-part of notation
 * @property {Function} m - returns modifiers-part of notation
 * @property {Function} t - returns technology-part of notation
 */
