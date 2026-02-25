import { expect } from 'chai';

import BemEntityName from '@bem/sdk.entity-name';

import BemCell from '../index.js';

describe('fields', () => {
    it('should provide `entity` field', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' })
        });

        expect(cell.entity.valueOf()).to.deep.equal({ block: 'block' });
    });

    it('should provide `tech` field', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            tech: 'css'
        });

        expect(cell.tech).to.equal('css');
    });

    it('should provide `layer` field', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            layer: 'desktop'
        });

        expect(cell.layer).to.equal('desktop');
    });
});
