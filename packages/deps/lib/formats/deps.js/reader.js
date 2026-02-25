import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

/**
 * Evaluates BEM deps file content.
 * BEM deps files use `module.exports` to export deps data.
 *
 * @param {string} code - File content to evaluate
 * @param {string} filename - Original file path (for error messages)
 * @returns {*} Evaluated module exports
 */
function nodeEval(code, filename) {
    const m = { exports: {} };
    const wrapped = `(function(module, exports, require) { ${code}\n})(m, m.exports, () => {})`;
    vm.runInNewContext(wrapped, { m }, { filename });
    return m.exports;
}

/**
 * Reads and evaluates BemFiles.
 *
 * @param {BemFile} f - file data to read
 * @returns {Promise<{file: BemFile, data: *, scope: BemEntityName}>}
 */
export default function read(f) {
    return readFile(f.path, 'utf8')
        .then(content => Object.assign(f, {
            data: nodeEval(content, f.path)
        }));
}
