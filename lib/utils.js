'use strict';

const naming = require('bem-naming');

const stringifyEntity = naming.stringify;
const typeOfEntity = naming.typeOf;

function findIndex(entities, entity) {
    if (typeof entity !== 'object' || !typeOfEntity(entity)) {
        return -1;
    }

    var id = stringifyEntity(entity),
        firstIndex = -1,
        length = entities.length;

    for (let i = 0; i < length; ++i) {
        let currentEntity = entities[i];

        if (typeof currentEntity === 'object' && typeOfEntity(currentEntity) && stringifyEntity(currentEntity) === id) {
            firstIndex = i;
            break;
        }
    }

    return firstIndex;
}

function findLastIndex(entities, entity) {
    if (typeof entity !== 'object' || !typeOfEntity(entity)) {
        return -1;
    }

    var id = stringifyEntity(entity),
        lastIndex = -1,
        length = entities.length;

    for (let i = length - 1; i >= 0; --i) {
        let currentEntity = entities[i];

        if (typeof currentEntity === 'object' && typeOfEntity(currentEntity) && stringifyEntity(currentEntity) === id) {
            lastIndex = i;
            break;
        }
    }

    return lastIndex;
}

module.exports = { findIndex, findLastIndex };
