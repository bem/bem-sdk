import { expect } from 'chai';

import BemEntityName from '@bem/sdk.entity-name';

import BemCell from '../index.js';

describe('value-of', () => {
    it('should return cell with entity', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' })
        });

        expect(cell.valueOf()).to.deep.equal({ entity: { block: 'block' } });
    });

    it('should return cell with entity and tech', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            tech: 'css'
        });

        expect(cell.valueOf()).to.deep.equal({ entity: { block: 'block' }, tech: 'css' });
    });

    it('should return cell with entity and layer', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            layer: 'desktop'
        });

        expect(cell.valueOf()).to.deep.equal({ entity: { block: 'block' }, layer: 'desktop' });
    });

    it('should return cell with entity and tech and layer', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            tech: 'css',
            layer: 'desktop'
        });

        expect(cell.valueOf()).to.deep.equal({ entity: { block: 'block' }, tech: 'css', layer: 'desktop' });
    });
});
