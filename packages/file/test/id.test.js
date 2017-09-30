'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemFile = require('..');

describe('id', () => {
    it('should provide `id` field', () => {
        const file = new BemFile({
            cell: {
                entity: { block: 'block' },
                layer: 'desktop',
                tech: 'css'
            }
        });

        expect(file.id).to.equal('block@desktop.css');
    });

    it('should provide `id` field for cell with entity `field` only', () => {
        const file = new BemFile({
            cell: { entity: { block: 'block' } }
        });

        expect(file.id).to.equal('block');
    });

    it('should provide `id` field for cell with `tech` field', () => {
        const file = new BemFile({
            cell: {
                entity: { block: 'block' },
                tech: 'css'
            }
        });

        expect(file.id).to.equal('block.css');
    });

    it('should provide `id` field for cell with `layer` field', () => {
        const file = new BemFile({
            cell: { entity: { block: 'block' }, layer: 'desktop' }
        });

        expect(file.id).to.equal('block@desktop');
    });

    it('should provide `id` field for cell with `layer` field', () => {
        const file = new BemFile({
            cell: { entity: { block: 'block' }, layer: 'desktop' },
            level: 'abc/def'
        });

        expect(file.id).to.equal('abc/def/block@desktop');
    });

    it('should cache `id` field', () => {
        const file = new BemFile({
            cell: {
                entity: { block: 'block' },
                layer: 'desktop',
                tech: 'css'
            }
        });
        const id = file.id;

        file._tech = 'js';
        file._layer = 'common';

        expect(file.id).to.equal(id);
    });
});
