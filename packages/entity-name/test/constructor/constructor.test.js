import { expect } from 'chai';

import BemEntityName from '../../index.js';

describe('constructor/constructor', () => {
    it('should create block', () => {
        const obj = { block: 'block' };
        const entityName = new BemEntityName(obj);

        expect((entityName).valueOf()).to.deep.equal(obj);
    });

    it('should create modifier of block', () => {
        const obj = { block: 'block', mod: { name: 'mod', val: 'val' } };
        const entityName = new BemEntityName(obj);

        expect((entityName).valueOf()).to.deep.equal(obj);
    });

    it('should create element', () => {
        const obj = { block: 'block', elem: 'elem' };
        const entityName = new BemEntityName(obj);

        expect((entityName).valueOf()).to.deep.equal(obj);
    });

    it('should create modifier of element', () => {
        const obj = { block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } };
        const entityName = new BemEntityName(obj);

        expect((entityName).valueOf()).to.deep.equal(obj);
    });
});
