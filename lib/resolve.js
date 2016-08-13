'use strict';

const buildGraph = require('./buildGraph');

/**
 * @param {BemEntityName[]} declaration
 * @param {Array<{vertex: BemEntityName, dependOn: BemEntityName, ordered: ?Boolean}>} relations
 * @param {{tech: ?String}} options
 * @returns {Array<{entity: BemEntityName, tech: String}>}
 */
module.exports = function (declaration, relations, options) {
    declaration || (declaration = []);
    relations || (relations = []);
    options || (options = {});

    const allEntities = Array.from(buildGraph(relations)
        .dependenciesOf(declaration, options.tech));

    const byTechIdx = {};
    return {
        // BemEntityName[] без технологий
        entities: allEntities.filter(e => !options.tech || e.tech === options.tech).map(e => e.entity),
        // Array<{tech: String, entities: BemEntityName[]}>
        dependOn: !options.tech ? [] : allEntities.filter(e => e.tech !== options.tech).reduce((res, e) => {
            byTechIdx[e.tech] || (byTechIdx[e.tech] = res.push({
                tech: e.tech,
                entities: []
            }) - 1); // for saving actual index, cs push returns length

            const entities = res[byTechIdx[e.tech]].entities;
            entities.push(e.entity);

            return res;
        }, [])
    };
};
