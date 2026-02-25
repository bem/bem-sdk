import { expect } from 'chai';
import sinon from 'sinon';
import esmock from 'esmock';

import BemEntityName from '../index.js';

describe('id', () => {
    it('should build equal id for equal blocks', () => {
        const entityName1 = new BemEntityName({ block: 'block' });
        const entityName2 = new BemEntityName({ block: 'block' });

        expect(entityName1.id).is.equal(entityName2.id);
    });

    it('should build not equal id for not equal blocks', () => {
        const entityName1 = new BemEntityName({ block: 'block1' });
        const entityName2 = new BemEntityName({ block: 'block2' });

        expect(entityName1.id).is.not.equal(entityName2.id);
    });

    it('should cache id value', async () => {
        const stub = sinon.stub().returns('id');
        const StubBemEntityName = (await esmock('../lib/entity-name.js', {
            '@bem/sdk.naming.entity.stringify': { default: () => stub }
        })).default;

        const entityName = new StubBemEntityName({ block: 'block' });

        /*eslint no-unused-expressions: "off"*/
        entityName.id;
        entityName.id;

        expect(stub.callCount).to.equal(1);
    });
});
