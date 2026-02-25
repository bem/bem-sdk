import { expect } from 'chai';

import BemEntityName from '@bem/sdk.entity-name';

import BemCell from '../index.js';

describe('id', () => {
    it('should provide `id` field', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            layer: 'desktop',
            tech: 'css'
        });

        expect(cell.id).to.equal('block@desktop.css');
    });

    it('should provide `id` field for cell with entity `field` only', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' })
        });

        expect(cell.id).to.equal('block');
    });

    it('should provide `id` field for cell with `tech` field', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            tech: 'css'
        });

        expect(cell.id).to.equal('block.css');
    });

    it('should provide `id` field for cell with `layer` field', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            layer: 'desktop'
        });

        expect(cell.id).to.equal('block@desktop');
    });

    it('should cache `id` field', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            layer: 'desktop',
            tech: 'css'
        });
        const id = cell.id;

        cell._tech = 'js';
        cell._layer = 'common';

        expect(cell.id).to.equal(id);
    });
});
