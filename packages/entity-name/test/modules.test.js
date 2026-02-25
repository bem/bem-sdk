import { expect } from 'chai';

import BemEntityName from '../index.js';

describe('modules', () => {
    it('should export default', () => {
        expect(BemEntityName).to.be.a('function');
        expect(BemEntityName.name).to.equal('BemEntityName');
    });
});
