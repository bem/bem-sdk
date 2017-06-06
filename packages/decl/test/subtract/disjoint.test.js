'use strict';

const test = require('ava');
const BemCell = require('@bem/cell');
const BemEntityName = require('@bem/entity-name');
const createCell = (cell) => new BemCell({
    entity: new BemEntityName(cell.entity),
    tech: cell.tech
});

const subtract = require('../../lib/subtract');

test('should not subtract other entities from block', t => {
    const decl1 = [{ entity: { block: 'block' } }].map(createCell);
    const decl2 = [
            { entity: { block: 'block', modName: 'mod', modVal: true } },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' } },
            { entity: { block: 'block', elem: 'elem' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }
        ].map(createCell);

    t.deepEqual(subtract(decl1, decl2), decl1);
});

test('should not subtract other entities from bool mod', t => {
    const decl1 = [{ entity: { block: 'block', modName: 'mod', modVal: true } }].map(createCell);
    const decl2 = [
            { entity: { block: 'block' } },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' } },
            { entity: { block: 'block', elem: 'elem' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }
        ].map(createCell);

    t.deepEqual(subtract(decl1, decl2), decl1);
});

test('should not subtract other entities from mod', t => {
    const decl1 = [{ entity: { block: 'block', modName: 'mod', modVal: 'val' } }].map(createCell);
    const decl2 = [
            { entity: { block: 'block' } },
            { entity: { block: 'block', modName: 'mod', modVal: true } },
            { entity: { block: 'block', elem: 'elem' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }
        ].map(createCell);

    t.deepEqual(subtract(decl1, decl2), decl1);
});

test('should not subtract other entities from elem', t => {
    const decl1 = [{ entity: { block: 'block', elem: 'elem' } }].map(createCell);
    const decl2 = [
            { entity: { block: 'block' } },
            { entity: { block: 'block', modName: 'mod', modVal: true } },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }
        ].map(createCell);

    t.deepEqual(subtract(decl1, decl2), decl1);
});

test('should not subtract other entities from bool mod of elem', t => {
    const decl1 = [{ entity: { block: 'block', elem: 'elem',  modName: 'mod', modVal: true } }].map(createCell);
    const decl2 = [
            { entity: { block: 'block' } },
            { entity: { block: 'block', modName: 'mod', modVal: true } },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' } },
            { entity: { block: 'block', elem: 'elem' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }
        ].map(createCell);

    t.deepEqual(subtract(decl1, decl2), decl1);
});

test('should not subtract other entities from mod of elem', t => {
    const decl1 = [{ entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }].map(createCell);
    const decl2 = [
            { entity: { block: 'block' } },
            { entity: { block: 'block', modName: 'mod', modVal: true } },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' } },
            { entity: { block: 'block', elem: 'elem' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } }
        ].map(createCell);

    t.deepEqual(subtract(decl1, decl2), decl1);
});
