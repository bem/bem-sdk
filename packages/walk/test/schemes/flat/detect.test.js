'use strict';

const test = require('ava');
const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../../lib/index');

const options = {
    levels: {
        blocks: { scheme: 'flat' }
    }
};

test.afterEach('restore fs', () => {
    mockFs.restore();
});

test('should detect block', t => {
    mockFs({
        blocks: {
            'block.tech': ''
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{ block: 'block' }]);
        });
});

test('should detect bool mod of block', t => {
    mockFs({
        blocks: {
            'block_mod.tech': ''
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{
                block: 'block',
                mod: { name: 'mod', val: true }
            }]);
        });
});

test('should detect key-val mod of block', t => {
    mockFs({
        blocks: {
            'block_mod_val.tech': ''
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{
                block: 'block',
                mod: { name: 'mod', val: 'val' }
            }]);
        });
});

test('should detect elem', t => {
    mockFs({
        blocks: {
            'block__elem.tech': ''
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{ block: 'block', elem: 'elem' }]);
        });
});

test('should detect bool mod of elem', t => {
    mockFs({
        blocks: {
            'block__elem_mod.tech': ''
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{
                block: 'block',
                elem: 'elem',
                mod: { name: 'mod', val: true }
            }]);
        });
});

test('should detect key-val mod of elem', t => {
    mockFs({
        blocks: {
            'block__elem_mod_val.tech': ''
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{
                block: 'block',
                elem: 'elem',
                mod: { name: 'mod', val: 'val' }
            }]);
        });
});
