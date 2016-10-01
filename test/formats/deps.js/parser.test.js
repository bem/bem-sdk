'use strict';

const test = require('ava');
const parser = require('../../../lib/formats/deps.js/parser');

const key = (v) => `${v.entity.id}${v.tech ? '.' + v.tech : ''}`;
const parse = (z) => {
    const res = parser(z);
    return res.map(v => `${key(v.vertex)} ${v.ordered ? '=>' : '->'} ${key(v.dependOn)}`);
};

test('should resolve empty', t => {
    t.deepEqual(parse([{
        entity: { block: 'be' }
    }]), [
    ]);
});

test('should resolve block deps', t => {
    t.deepEqual(parse([{
        entity: { block: 'be' },
        data: [{ shouldDeps: { block: 'b1' } }]
    }]), [
        'be -> b1'
    ]);
});

test('should resolve elems', t => {
    t.deepEqual(parse([{
        entity: { block: 'be' },
        data: [{ shouldDeps: { elem: ['e1', 'e2'] } }]
    }]), [
        'be -> be__e1',
        'be -> be__e2'
    ]);
});

test('should resolve block with tech', t => {
    t.deepEqual(parse([{
        entity: { block: 'be' },
        data: [{ tech: 'js', shouldDeps: [{ tech: 'bemhtml', block: 'b1' }] }]
    }]), [
        'be.js -> b1.bemhtml'
    ]);
});

test('should resolve and unify deps from several sources', t => {
    t.deepEqual(parse([{
        entity: { block: 'b1' },
        data: [{
            shouldDeps: [{ elems: ['e1', 'e2'] }, { mods: { theme: 'normal' } }]
        }, {
            mustDeps: [{ block: 'i-bem', elem: ['dom'] }, { block: 'ua' }],
        }]
    }, {
        entity: { block: 'b2' },
        data: [{
            shouldDeps: { elem: 'e3' },
            mustDeps: { mods: { theme: 'islands' } }
        }]
    }]), [
        'b1 => i-bem__dom',
        'b1 => ua',
        'b2 => b2_theme',
        'b2 => b2_theme_islands',
        'b1 -> b1__e1',
        'b1 -> b1__e2',
        'b1 -> b1_theme',
        'b1 -> b1_theme_normal',
        'b2 -> b2__e3'
    ]);
});

test('should resolve cross-tech deps', t => {
    t.deepEqual(parse([{
        entity: { block: 'be' },
        data: [{
            tech: 'tmpl-spec.js',
            shouldDeps: [{ tech: 'bemhtml', elems: ['e1', 'e2'] }, { tech: 'i18n', block: 'translations' }]
        }]
    }]), [
        'be.tmpl-spec.js -> be.bemhtml',
        'be.tmpl-spec.js -> be__e1.bemhtml',
        'be.tmpl-spec.js -> be__e2.bemhtml',
        'be.tmpl-spec.js -> translations.i18n'
    ]);
});

test('should use elem field in objects as context', t => {
    t.deepEqual(parse([{
        entity: { block: 'be' },
        data: [{ elem: 'ea', shouldDeps: [{ elem: 'e0' }] }]
    }]), [
        'be__ea -> be__e0'
    ]);
});

test('should use block field in objects as context', t => {
    t.deepEqual(parse([{
        entity: { block: 'be' },
        data: [{ block: 'ba', shouldDeps: [{ elem: 'e1' }] }]
    }]), [
        'ba -> ba__e1'
    ]);
});

test('should use block and elem fields in objects as context', t => {
    t.deepEqual(parse([{
        entity: { block: 'be' },
        data: [{
            block: 'ba',
            elem: 'ea',
            shouldDeps: [{ elem: 'e2' }]
        }]
    }]), [
        'ba__ea -> ba__e2'
    ]);
});

test('should resolve elems with noDeps', t => {
    t.deepEqual(parse([{
        entity: { block: 'be' },
        data: [{ shouldDeps: { elem: 'e1' }, noDeps: { elem: 'e2' } }]
    }]), [
        'be -> be__e1'
    ]);
});

test('should resolve elems with noDeps and remove if needed', t => {
    t.deepEqual(parse([{
        entity: { block: 'be' },
        data: [{ shouldDeps: { elem: ['e1', 'e2'] }, noDeps: { elem: 'e2' } }]
    }]), [
        'be -> be__e1'
    ]);
});
