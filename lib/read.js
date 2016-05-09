import stream from 'stream';
import naming from 'bem-naming';
import walk from 'bem-walk';
import defaultReader from './formats/deps.js/reader';

// returns `output` stream which will flush each entity data (totalEntityFiles === 0)
// and ends when no more deps left (totalDepsFiles === 0)
export default function read(config, reader=defaultReader) {
    var output = new stream.Readable({ objectMode: true }),
        deps = {},
        isInited = false,
        totalDepsFiles = 0,
        walker = walk(config.levels, { defaults: config.options });

    walker.on('data', function (file) {
        if (file.tech !== 'deps.js') return;

        isInited = true;
        totalDepsFiles++;

        var name = naming.stringify(file.entity);

        deps[name] ?
            deps[name].files.push(file) :
            deps[name] = {
                files: [file],
                techs: {}
            };
    });

    walker.on('end', function () {
        Object.keys(deps).forEach(function (name) {
            var files = deps[name].files,
                totalEntityFiles = files.length;

            files.forEach(function (file) {
                reader(file, function (err, depsFile) {
                    if (err) {
                        output.emit('error', err);
                        output.push(null);
                        return;
                    }

                    totalDepsFiles--;
                    totalEntityFiles--;

                    depsFile.forEach(function (oneTechDeps) {
                        var techs = deps[name].techs,
                            techName = oneTechDeps.tech || '';

                        techs[techName] || (techs[techName] = []);
                        techs[techName].push([oneTechDeps]);
                    });

                    if (!totalDepsFiles && !totalEntityFiles) {
                        Object.keys(deps).forEach(function (name) {
                            var techs = deps[name].techs;

                            Object.keys(techs).forEach(function (techName) {
                                techs[techName].forEach(function (depsByTech) {
                                    depsByTech.forEach(function (dep) {
                                        var entity = {
                                            block: dep.block
                                        };

                                        dep.elem && (entity.elem = dep.elem);
                                        dep.modName && (entity.modName = dep.modName);
                                        dep.modVal && (entity.modVal = dep.modVal);

                                        output.push({
                                            entity: entity,
                                            tech: techName,
                                            deps: techs[techName]
                                        });
                                    });
                                });
                            });
                        });

                        output.push(null);
                    }
                });
            });
        });
    });

    output._read = function () {};

    return output;
}
