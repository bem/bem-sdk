import { stringify as stringifyEntity } from 'bem-naming';
import DependencyGraph from './dependency-graph';
import addNativeDependencies from './add-native-dependencies';
import isRelationWithRequiredTech from './is-relation-with-required-tech';
import isDeclarationDependency from './is-declaration-dependency';

export default function resolve(declaration, relations, options) {
    var requiredTech = options.tech,
        dependencyGraph = new DependencyGraph(),
        dependenceEntityById = new Map(),
        dependenceEntitiesByTech = new Map();

    for (let relation of relations) {
        if (!isRelationWithRequiredTech(relation, requiredTech)) continue;

        for (let dependency of relation.dependOn) {
            if (isDeclarationDependency(relation.tech, dependency.tech, requiredTech)) {
                addDeclarationDependency(dependency);
            } else {
                dependencyGraph.addDependency(relation.entity, dependency.entity, { order: dependency.order });
            }
        }
    }

    function addDeclarationDependency(dependency) {
        var tech = dependency.tech,
            id = stringifyEntity(dependency.entity);

        if (!dependenceEntitiesByTech.has(tech)) {
            dependenceEntitiesByTech.set(tech, new Set());
        }

        dependenceEntitiesByTech.get(tech).add(id);
        dependenceEntityById.set(id, dependency.entity);
    }

    var declarationDependOn = [];
    dependenceEntitiesByTech.forEach(function (dependenceEntities, tech) {
        declarationDependOn.push({
            tech: tech,
            entities: Array.from(dependenceEntities).map(function (id) {
                return dependenceEntityById.get(id);
            })
        });
    });

    addNativeDependencies(declaration, dependencyGraph);

    var visitedIds = new Set(),
        addedIds = new Set(),
        resolvedDeclaration = [];

    for (let declarationEntity of declaration) {
        var entities = [];

        visitedIds.add(declarationEntity.id);
        declarationEntity.id = stringifyEntity(declarationEntity);
        entities.push(declarationEntity);

        var indexOf = entityId => entities.map(v => v.id).indexOf(entityId);

        for (let [dependenceEntity, order, previousId] of dependencyGraph.entitiesFrom(declarationEntity)) {
            if (declarationEntity.id === dependenceEntity.id) continue;
            if (visitedIds.has(dependenceEntity.id)) continue;

            visitedIds.add(dependenceEntity.id);

            let idx = indexOf(previousId);

            if (order) {
                // [0, 1, 2].splice(1, 0, 4) => [0, 4, 1, 2]
                entities.splice(idx, 0, dependenceEntity);
            } else {
                entities.push(dependenceEntity);
            }
        }

        for (let dependenceEntity of entities) {
            let dependenceEntityId = stringifyEntity(dependenceEntity);
            if (!addedIds.has(dependenceEntityId)) {
                resolvedDeclaration.push(dependenceEntity);
                addedIds.add(dependenceEntityId);
            }
        }
    }

    return {
        entities: resolvedDeclaration.map(v => {
 delete v.id; return v;
 }),
        dependOn: declarationDependOn
    };
}
