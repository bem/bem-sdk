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
 * * {string} basename — the name of file or directory (the last portion of a path).
 * * {string} stem - the name without tech name (complex extention).
 * * {string} tech - the complex extention for the file or directory path.
 *
 * @param {string}   dirname — the path to directory.
 * @param {function} fn — the function that is called on each file or directory.
 * @param {function} callback — the callback function.
 */
const eachDirItem = (dirname, fn, callback) => {
    fs.readdir(dirname, (err, filenames) => {
        if (err) {
            return callback(err);
        }

        const files = filenames.map(basename => {
            const dotIndex = basename.indexOf('.');

            // has tech
            if (dotIndex > 0) {
                return {
                    path: path.join(dirname, basename),
                    basename: basename,
                    stem: basename.substring(0, dotIndex),
                    tech: basename.substring(dotIndex + 1)
                };
            }

            return {
                path: path.join(dirname, basename),
                basename: basename,
                stem: basename
            };
        });

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

        this.add = add;
    }
    /**
     * Scans the level fully.
     *
     * @param {function} callback — the callback function.
     */
    scanLevel (callback) {
        eachDirItem(this.levelpath, (item, cb) => {
            const entity = this.naming.parse(item.stem);
            const type = entity && entity.type;

            if (!item.tech && type === 'block') {
                return this.scanBlockDir(item.path, item.basename, cb);
            }

            cb();
        }, callback);
    }
    /**
     * Scans the block directory.
     *
     * @param {string} dirname - the path to directory of block.
     * @param {string} blockname - the name of block.
     * @param {function} callback — the callback function.
     */
    scanBlockDir (dirname, blockname, callback) {
        eachDirItem(dirname, (item, cb) => {
            const filename = item.path;
            const stem = item.stem;
            const tech = item.tech;

            if (tech) {
                if (blockname === stem) {
                    this.add(new BemFile({
                        cell: {
                            block: blockname,
                            tech: tech,
                            layer: null
                        },
                        level: this.levelpath,
                        path: filename
                    }));
                }

                return cb();
            }

            const entity = this.naming.parse(blockname + stem);
            const type = entity && entity.type;

            if (type === 'blockMod') {
                return this.scanBlockModDir(filename, entity, cb);
            }

            if (type === 'elem') {
                return this.scanElemDir(filename, entity, cb);
            }

            cb();
        }, callback);
    }
    /**
     * Scans the modifier of block directory.
     *
     * @param {string} dirname - the path to directory of modifier.
     * @param {object} scope - the entity object for modifier.
     * @param {function} callback — the callback function.
     */
    scanBlockModDir (dirname, scope, callback) {
        eachDirItem(dirname, (item, cb) => {
            const entity = this.naming.parse(item.stem);
            const tech = item.tech;

            // Find file with same modifier name.
            if (tech && entity && scope.block === entity.block
                && scope.mod.name === (entity.mod && entity.mod.name)) {
                this.add(new BemFile({
                    cell: {
                        entity: entity,
                        tech: tech,
                        layer: null
                    },
                    level: this.levelpath,
                    path: item.path
                }));
            }

            cb();
        }, callback);
    }
    /**
     * Scans the element directory.
     *
     * @param {string} dirname - the path to directory of element.
     * @param {object} scope - the entity object for element.
     * @param {function} callback — the callback function.
     */
    scanElemDir (dirname, scope, callback) {
        eachDirItem(dirname, (item, cb) => {
            const filename = item.path;
            const stem = item.stem;
            const tech = item.tech;

            if (tech) {
                // Find file with same element name.
                if (this.naming.stringify(scope) === stem) {
                    const entity = this.naming.parse(stem);

                    this.add(new BemFile({
                        cell: {
                            entity: entity,
                            tech: tech,
                            layer: null
                        },
                        level: this.levelpath,
                        path: item.path
                    }));
                }

                return cb();
            }

            const entity = this.naming.parse(scope.block + path.basename(dirname) + stem);
            const type = entity && entity.type;

            if (type === 'elemMod') {
                return this.scanElemModDir(filename, entity, cb);
            }

            cb();
        }, callback);
    }
    /**
     * Scans the modifier of element directory.
     *
     * @param {string} dirname - the path to directory of modifier.
     * @param {object} scope - the entity object for modifier.
     * @param {function} callback — the callback function.
     */
    scanElemModDir (dirname, scope, callback) {
        eachDirItem(dirname, (item, cb) => {
            const entity = this.naming.parse(item.stem);
            const tech = item.tech;

            // Find file with same modifier name.
            if (tech && entity
                && scope.block === entity.block
                && scope.elem === entity.elem
                && scope.mod.name === (entity.mod && entity.mod.name)
            ) {
                this.add(new BemFile({
                    cell: {
                        entity: entity,
                        tech: tech,
                        layer: null
                    },
                    level: this.levelpath,
                    path: item.path
                }));
            }

            cb();
        }, callback);
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
