'use strict';

const stringifyEntity = require('bem-naming').stringify;
const DependencyGraph = require('./dependency-graph');
const addNativeDependencies = require('./add-native-dependencies');
const isRelationWithRequiredTech = require('./is-relation-with-required-tech');
const isDeclarationDependency = require('./is-declaration-dependency');

module.exports = function resolve(declaration, relations, options) {
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

        for (let arr of dependencyGraph.entitiesFrom(declarationEntity)) {
            const dependenceEntity = arr[0];
            const order = arr[1];
            const previousId = arr[1];

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
};
