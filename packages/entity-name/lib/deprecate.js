'use strict';

const util = require('util');

const deprecate = require('depd')('@bem/sdk.entity-name');

/**
 * Logs deprecation messages.
 *
 * @param {object} obj
 * @param {string} deprecateName
 * @param {string} newName
 */
module.exports = (obj, deprecateName, newName) => {
    const objStr = util.inspect(obj, { depth: 1 });
    const message = [
        `\`${deprecateName}\` is kept just for compatibility and can be dropped in the future.`,
        `Use \`${newName}\` instead in \`${objStr}\` at`
    ].join(' ');

    deprecate(message);
};
