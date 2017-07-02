'use strict';

const BemEntityName = require('@bem/entity-name');

/**
 * Builds regex for specified naming convention.
 *
 * @param {BemNamingDelims} delims — separates entity names from each other.
 * @param {String} wordPattern — defines which symbols can be used for block, element and modifier's names.
 * @returns {RegExp}
 */
function buildRegex(delims, wordPattern) {
    const block = '(' + wordPattern + ')';
    const elem = '(?:' + delims.elem + '(' + wordPattern + '))?';
    const modName = '(?:' + delims.mod.name + '(' + wordPattern + '))?';
    const modVal = '(?:' + delims.mod.val + '(' + wordPattern + '))?';
    const mod = modName + modVal;

    return new RegExp('^' + block + mod + '$|^' + block + elem + mod + '$');
}

/**
 * Parses string into object representation.
 *
 * @param {String} str - string representation of BEM entity.
 * @param {RegExp} regex - build regex for specified naming.
 * @returns {BemEntityName|undefined}
 */
function parse(str, regex) {
    const executed = regex.exec(str);

    if (!executed) { return undefined; }

    const modName = executed[2] || executed[6];

    return new BemEntityName({
        block: executed[1] || executed[4],
        elem: executed[5],
        mod: modName && {
            name: modName,
            val: executed[3] || executed[7] || true
        }
    });
}

/**
 * Creates `parse` function for specified naming convention.
 *
 * @param {BemNamingConvention} convention - options for naming convention.
 * @returns {Function}
 */
module.exports = (convention) => {
    const regex = buildRegex(convention.delims, convention.wordPattern);

    return (str) => parse(str, regex);
};
