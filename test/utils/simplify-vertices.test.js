'use strict';

const test = require('ava');

const simplifyVertices = utils.simplifyVertices;
const createVertex = utils.createVertex;

test('should simplify vertex', t => {
    t.deepEqual(simplifyVertices([
        createVertex({block: 'a'}),
        createVertex({block: 'b', elem: 'e'}),
        createVertex({block: 'c', modName: 'm', modVal: true})
    ]), [
        {entity: {block: 'a'}},
        {entity: {block: 'b', elem: 'e'}},
        {entity: {block: 'c', mod: {name: 'm', val: true}}}
    ]);
});
