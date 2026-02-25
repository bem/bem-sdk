import fs from 'node:fs';
import path from 'node:path';

import namingEntityParse from '@bem/sdk.naming.entity.parse';
import createNamingPreset from '@bem/sdk.naming.presets/create';
import BemFile from '@bem/sdk.file';

/**
 * Plugin to scan flat levels.
 *
 * @param {object}        info        The info about scaned level.
 * @param {string}        info.path   The level path to scan.
 * @param {object|string} info.naming The naming options.
 * @param {function}      add         The function to provide info about found files.
 * @param {function}      callback    The callback function.
 */
const flat = (info, add, callback) => {
    const levelpath = info.path;
    // Create `@bem/sdk.naming.preset` instance for specified options.
    const parseEntityName = namingEntityParse(createNamingPreset(info.naming));

    fs.readdir(levelpath, (err, files) => {
        if (err) {
            return callback(err);
        }

        files.forEach(basename => {
            const dotIndex = basename.indexOf('.');

            // has tech
            if (dotIndex > 0) {
                const entity = parseEntityName(basename.substring(0, dotIndex));

                entity && add(new BemFile({
                    cell: {
                        entity: entity,
                        tech: basename.substring(dotIndex + 1),
                        layer: null
                    },
                    level: levelpath,
                    path: path.join(levelpath, basename)
                }));
            }
        });

        callback();
    });
};

export default flat;
