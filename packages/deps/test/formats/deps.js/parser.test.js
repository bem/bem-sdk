'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const parser = require('../../../lib/formats/deps.js/parser');

const key = (v) => `${v.entity.id}${v.tech ? '.' + v.tech : ''}`;
const parse = (z) => {
    const res = parser(z);
    return res.map(v => `${key(v.vertex)} ${v.ordered ? '=>' : '->'} ${key(v.dependOn)}`);
};

describe('parser', () => {
    it('should resolve empty', () => {
        expect(parse([{
            entity: { block: 'be' }
        }])).to.deep.equal([]);
    });

    it('should resolve block deps', () => {
        expect(parse([{
            entity: { block: 'be' },
            data: [{ shouldDeps: { block: 'b1' } }]
        }])).to.deep.equal([
            'be -> b1'
        ]);
    });

    it('should resolve elems', () => {
        expect(parse([{
            entity: { block: 'be' },
            data: [{ shouldDeps: { elem: ['e1', 'e2'] } }]
        }])).to.deep.equal([
            'be -> be__e1',
            'be -> be__e2'
        ]);
    });

    it('should resolve block with tech', () => {
        expect(parse([{
            entity: { block: 'be' },
            data: [{ tech: 'js', shouldDeps: [{ tech: 'bemhtml', block: 'b1' }] }]
        }])).to.deep.equal([
            'be.js -> b1.bemhtml'
        ]);
    });

    it('should resolve and unify deps from several sources', () => {
        expect(parse([{
            entity: { block: 'b1' },
            data: [{
                shouldDeps: [{ elems: ['e1', 'e2'] }, { mods: { theme: 'normal' } }]
            }, {
                mustDeps: [{ block: 'i-bem', elem: ['dom'] }, { block: 'ua' }]
            }]
        }, {
            entity: { block: 'b2' },
            data: [{
                shouldDeps: { elem: 'e3' },
                mustDeps: { mods: { theme: 'islands' } }
            }]
        }])).to.deep.equal([
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

    it('should resolve cross-tech deps', () => {
        expect(parse([{
            entity: { block: 'be' },
            data: [{
                tech: 'tmpl-spec.js',
                shouldDeps: [{ tech: 'bemhtml', elems: ['e1', 'e2'] }, { tech: 'i18n', block: 'translations' }]
            }]
        }])).to.deep.equal([
            'be.tmpl-spec.js -> be.bemhtml',
            'be.tmpl-spec.js -> be__e1.bemhtml',
            'be.tmpl-spec.js -> be__e2.bemhtml',
            'be.tmpl-spec.js -> translations.i18n'
        ]);
    });

    it('should use elem field in objects as context', () => {
        expect(parse([{
            entity: { block: 'be' },
            data: [{ elem: 'ea', shouldDeps: [{ elem: 'e0' }] }]
        }])).to.deep.equal([
            'be__ea -> be__e0'
        ]);
    });

    it('should use block field in objects as context', () => {
        expect(parse([{
            entity: { block: 'be' },
            data: [{ block: 'ba', shouldDeps: [{ elem: 'e1' }] }]
        }])).to.deep.equal([
            'ba -> ba__e1'
        ]);
    });

    it('should use block and elem fields in objects as context', () => {
        expect(parse([{
            entity: { block: 'be' },
            data: [{
                block: 'ba',
                elem: 'ea',
                shouldDeps: [{ elem: 'e2' }]
            }]
        }])).to.deep.equal([
            'ba__ea -> ba__e2'
        ]);
    });

    it('should resolve elems with noDeps', () => {
        expect(parse([{
            entity: { block: 'be' },
            data: [{ shouldDeps: { elem: 'e1' }, noDeps: { elem: 'e2' } }]
        }])).to.deep.equal([
            'be -> be__e1'
        ]);
    });

    it('should resolve elems with noDeps and remove if needed', () => {
        expect(parse([{
            entity: { block: 'be' },
            data: [{ shouldDeps: { elem: ['e1', 'e2'] }, noDeps: { elem: 'e2' } }]
        }])).to.deep.equal([
            'be -> be__e1'
        ]);
    });
});
