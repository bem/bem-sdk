'use strict';

const test = require('ava');

const BemGraph = lib.BemGraph;
const findIndex = utils.findIndex;

test.skip('should place block before its element', t => {
    const graph = new BemGraph();

    const decl = Array.from(graph.dependenciesOf([
        { block: 'block', elem: 'elem' },
        { block: 'block' }
    ]));

    const indexBlock = findIndex(decl, { entity: { block: 'block' } });
    const indexElem = findIndex(decl, { entity: { block: 'block', elem: 'elem' } });

    t.true(indexBlock < indexElem);
});

test.skip('should place block before its boolean modifier', t => {
    const graph = new BemGraph();

    const decl = Array.from(graph.dependenciesOf([
        { block: 'block', modName: 'mod', modVal: true },
        { block: 'block' }
    ]));

    const indexBlock = findIndex(decl, { entity: { block: 'block' } });
    const indexModifier = findIndex(decl, { entity: { block: 'block', modName: 'mod' } });

    t.true(indexBlock < indexModifier);
});

test.skip('should place block before its key-value modifier', t => {
    const graph = new BemGraph();

    const decl = Array.from(graph.dependenciesOf([
        { block: 'block', modName: 'mod', modVal: 'val' },
        { block: 'block' }
    ]));

    const indexBlock = findIndex(decl, { entity: { block: 'block' } });
    const indexModifier = findIndex(decl, { entity: { block: 'block', modName: 'mod', modVal: 'val' } });

    t.true(indexBlock < indexModifier);
});

test.skip('should place block before its element with boolean modifier', t => {
    const graph = new BemGraph();

    const decl = Array.from(graph.dependenciesOf([
        { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
        { block: 'block' }
    ]));

    const indexBlock = findIndex(decl, { entity: { block: 'block' } });
    const indexElem = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } });

    t.true(indexBlock < indexElem);
});

test.skip('should place block before its element with key-value modifier', t => {
    const graph = new BemGraph();

    const decl = Array.from(graph.dependenciesOf([
        { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
        { block: 'block' }
    ]));

    const indexBlock = findIndex(decl, { entity: { block: 'block' } });
    const indexElem = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } });

    t.true(indexBlock < indexElem);
});

test.skip('should place block\'s boolean modifier before block\' key-value modifier', t => {
    const graph = new BemGraph();

    const decl = Array.from(graph.dependenciesOf([
        { block: 'block', modName: 'mod', modVal: 'val' },
        { block: 'block', modName: 'mod', modVal: true }
    ]));

    const indexBoolean = findIndex(decl, { entity: { block: 'block', modName: 'mod', modVal: true } });
    const indexKeyValue = findIndex(decl, { entity: { block: 'block', modName: 'mod', modVal: 'val' } });

    t.true(indexBoolean < indexKeyValue);
});

test.skip('should place elem before its boolean modifier', t => {
    const graph = new BemGraph();

    const decl = Array.from(graph.dependenciesOf([
        { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
        { block: 'block', elem: 'elem' }
    ]));

    const indexElem = findIndex(decl, { entity: { block: 'block', elem: 'elem' } });
    const indexModifier = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } });

    t.true(indexElem < indexModifier);
});

test.skip('should place elem before its key-value modifier', t => {
    const graph = new BemGraph();

    const decl = Array.from(graph.dependenciesOf([
        { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
        { block: 'block', elem: 'elem' }
    ]));

    const indexElem = findIndex(decl, { entity: { block: 'block', elem: 'elem' } });
    const indexModifier = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } });

    t.true(indexElem < indexModifier);
});

test.skip('should place elem\'s boolean modifier before elem\' key-value modifier', t => {
    const graph = new BemGraph();

    const decl = Array.from(graph.dependenciesOf([
        { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
        { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
    ]));

    const indexBoolean = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } });
    const indexKeyValue = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } });

    t.true(indexBoolean < indexKeyValue);
});
