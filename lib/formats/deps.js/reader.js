import fs from 'fs';
import normalize from './normalize';

/**
 * Reads file and calls callback with normalized dependency object
 */
export default function reader(file, cb) {
    fs.readFile(file.path, function (err, depsText) {
        if (err) return cb(err);

        /*jslint evil: true */
        var parsedDeps = eval(depsText.toString());

        Array.isArray(parsedDeps) || (parsedDeps = [parsedDeps]);

        cb(null, parsedDeps.map(function (dep) {
            ['mustDeps', 'shouldDeps', 'noDeps'].forEach(function (depsType) {
                dep[depsType] = normalize(dep[depsType]);

                dep[depsType].forEach(function (entity) {
                    entity.block || (entity.block = file.entity.block);
                    entity.elem || (entity.elem = file.entity.elem);
                });
            });

            ['block', 'elem', 'modName', 'modVal'].forEach(function (field) {
                if (!dep[field] && file.entity[field]) dep[field] = file.entity[field];
            });

            return dep;
        }));
    });
}
