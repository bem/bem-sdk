import { inspect } from 'node:util';

const warned = new Set();

/**
 * Logs deprecation messages.
 *
 * @param {object} obj
 * @param {string} deprecateName
 * @param {string} newName
 */
const deprecate = (obj, deprecateName, newName) => {
    const objStr = inspect(obj, { depth: 1 });
    const message = [
        `\`${deprecateName}\` is kept just for compatibility and can be dropped in the future.`,
        `Use \`${newName}\` instead in \`${objStr}\` at`
    ].join(' ');

    if (!warned.has(message)) {
        warned.add(message);
        process.emitWarning(message, 'DeprecationWarning');
    }
};

export default deprecate;
