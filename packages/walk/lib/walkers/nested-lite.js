'use strict';

const fs = require('fs');
const path = require('path');

const each = require('async-each');
const BemFile = require('@bem/sdk.file');
const createPreset = require('@bem/sdk.naming.presets/create');
const createParse = require('@bem/sdk.naming.entity.parse');
const createStringify = require('@bem/sdk.naming.entity.stringify');

/**
 * Calls specified callback for each file or directory in specified directory.
 *
 * Each item is object with the following fields:
 * * {string} path — the absolute path to file or directory.
 * * {array} bemPath — the absolute path to file or directory.
 *
 * @param {string}   dirname The path to directory.
 * @param {?array}   bemPath The BEM directory path.
 * @param {function} fn — the function that is called on each file or directory.
 * @param {function} callback — the callback function.
 */
const eachDirItem = (dirname, bemPath, fn, callback) => {
    fs.readdir(dirname, (err, filenames) => {
        if (err) {
            return callback(err);
        }

        bemPath || (bemPath = [])

        const files = filenames.map(basename => ({
            path: path.join(dirname, basename),
            bemPath : bemPath.concat([basename]),
        }));

        each(files, fn, callback);
    });
};

/**
 * Helper to scan one level.
 */
class LevelWalker {
    /**
     * @param {object}        info        The info about scaned level.
     * @param {string}        info.path   The level path to scan.
     * @param {object|string} info.naming The naming options.
     * @param {function}      add         The function to provide info about found files.
     */
    constructor (info, add) {
        this.levelpath = info.path;

        const preset = createPreset(info.naming);
        // Create `@bem/sdk.naming` instance for specified options.
        this.naming = {
            parse: createParse(preset),
            stringify: createStringify(preset)
        };

        this.entityTypeGraph = {
            block : ['elem', 'blockMod'],
            blockMod : ['blockMod'], // for block mod val
            elem : ['elemMod'],
            elemMod : ['elemMod'] // for elem mod val
        };

        this.add = add;
    }
    /**
     * Scans the level fully.
     *
     * @param {function} callback — the callback function.
     */
    scanLevel (callback) {
        eachDirItem(this.levelpath, null, (item, cb) => {
            const entity = this.naming.parse(item.bemPath[0]);
            const type = entity && entity.type;

            if (type === 'block') {
                return this.scanBemDir(item.path, item.bemPath, entity, cb);
            }

            cb();
        }, callback);
    }
    /**
     * Scans the BEM directory.
     *
     * @param {string}        dirname    The path to directory of block.
     * @param {array}         bemPath    BEM directory path [block, elem, mod, val, tech].
     * @param {BemEntityName} scope      Scaning Entity name info.
     * @param {function}      callback   The callback function.
     */
    scanBemDir (dirname, bemPath, scope, callback) {
        eachDirItem(dirname, bemPath, (item, cb) => {
            const cell = this.parseBemCell(item.bemPath);
            const entity = cell.entity;

            if (!entity) {
                return cb();
            }

            const filename = item.path;

            if (cell.tech) {
                this.add(new BemFile({
                    cell : cell,
                    level: this.levelpath,
                    path: filename
                }));

                return cb();
            }

            // Strict mode for walk
            if(scope && !this.isAllowedEntityGraph(scope, entity)) {
                return cb();
            }

            return this.scanBemDir(filename, item.bemPath, entity, cb);

        }, callback);
    }
    /**
     * @param {BemEntityName} entity
     * @param {BemEntityName} nextEntity
     *
     * @returns {boolean}
     */
    isAllowedEntityGraph (entity, nextEntity) {
        if(nextEntity.isSimpleMod() === false && !entity.isSimpleMod()) {
            return false;
        }

        const graph = this.entityTypeGraph[entity.type];
        return graph && graph.indexOf(nextEntity.type) !== -1
    }
    /**
     * Builds bemCell info about scan bem directory
     *
     * @param {array} bemPath
     *
     * @returns {object}
     */
    parseBemCell (bemPath) {
        const items = bemPath.slice(0);
        const len = items.length;
        const lastItem = items[len - 1];
        const tech = (len > 1 && this.isTech(lastItem)) ? items.pop() : null;
        const entity = this.naming.parse(items.join(''));

        return {
            entity : entity,
            tech : tech,
            layer: null
        }
    }
    /**
     * Checks filename is tech
     * Skip block. block === tech in block
     *
     * @param {string} basename - filebasename
     *
     * @returns {boolean}
     */
    isTech (basename) {
        // example: styles.css
        if(basename.indexOf('.') !== -1) {
            return true;
        }

        // example: i18n
        const entity = this.naming.parse(basename);
        return entity && entity.block;
    }
}

/**
 * Plugin to scan nested levels.
 *
 * @param {object}        info        The info about scaned level.
 * @param {string}        info.path   The level path to scan.
 * @param {function}      add         The function to provide info about found files.
 * @param {function}      callback    The callback function.
 */
module.exports = (info, add, callback) => {
    const walker = new LevelWalker(info, add);

    walker.scanLevel(callback);
};
