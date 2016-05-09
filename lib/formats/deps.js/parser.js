import _ from 'lodash';
import naming from 'bem-naming';

export default function parser(entityDeps) {
    var result = {
        entity: entityDeps.entity,
        dependOn: []
    };

    function normalize(deps) {
        if (typeof deps === 'string') {
            deps = { block: deps };
        }

        if (!Array.isArray(deps)) {
            deps = [deps];
        }

        return deps;
    }

    function add(mustOrShouldDeps, isMust) {
        if (!mustOrShouldDeps) return;

        normalize(mustOrShouldDeps).forEach(function (dep) {
            var dependOnEntity = {
                block: dep.block
            };

            ['elem', 'modName', 'modVal'].forEach(function (field) {
                dep[field] && (dependOnEntity[field] = dep[field]);
            });

            var dependency = {
                entity: dependOnEntity,
                tech: dep.tech
            };

            isMust && (dependency.order = 'dependenceBeforeDependants');

            _.some(result.dependOn, dependency) || result.dependOn.push(dependency);
        });
    }

    function remove(noDeps) {
        noDeps.forEach(function (noDep) {
            result.dependOn.forEach(function (dep, idx) {
                if ((naming.stringify(dep.entity) + dep.tech) === (naming.stringify(noDep) + noDep.tech)) {
                    result.dependOn.splice(idx, 1);
                }
            });
        });
    }

    // `entityDeps.deps` is an array of all entity dependencies from all files
    entityDeps.deps.forEach(function (entityOneFileDeps) {
        entityOneFileDeps.forEach(function (oneTechDeps) {
            oneTechDeps.tech && (result.tech = oneTechDeps.tech);

            add(oneTechDeps.mustDeps, true);
            add(oneTechDeps.shouldDeps);
            remove(oneTechDeps.noDeps);
        });
    });

    return result;
}
