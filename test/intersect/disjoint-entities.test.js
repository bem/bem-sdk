'use strict';

const test = require('ava');
const createCell = require('../util').createCell;

const intersect = require('../../lib/intersect');

test('should not intersect other entities from block', t => {
    const decl1 = [{ entity: { block: 'block' }, tech: null }].map(createCell);
    const decl2 = [
        { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
        { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null },
        { entity: { block: 'block', elem: 'elem' }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
    ].map(createCell);

    t.deepEqual(intersect(decl1, decl2), []);
});

test('should not intersect other entities from bool mod', t => {
    const decl1 = [{ entity: { block: 'block', modName: 'mod', modVal: true }, tech: null }].map(createCell);
    const decl2 = [
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);

    t.deepEqual(intersect(decl1, decl2), []);
});

test('should not intersect other entities from mod', t => {
    const decl1 = [{ entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null }].map(createCell);
    const decl2 = [
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);

    t.deepEqual(intersect(decl1, decl2), []);
});

test('should not intersect other entities from elem', t => {
    const decl1 = [{ entity: { block: 'block', elem: 'elem' }, tech: null }].map(createCell);
    const decl2 = [
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null },
        ].map(createCell);

    t.deepEqual(intersect(decl1, decl2), []);
});

test('should not intersect other entities from bool mod of elem', t => {
    const decl1 = [
            { entity: { block: 'block', elem: 'elem',  modName: 'mod', modVal: true }, tech: null }
        ].map(createCell);
    const decl2 = [
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);

    t.deepEqual(intersect(decl1, decl2), []);
});

test('should not intersect other entities from mod of elem', t => {
    const decl1 = [
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);
    const decl2 = [
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null }
        ].map(createCell);

    t.deepEqual(intersect(decl1, decl2), []);
});
