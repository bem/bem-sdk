'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const BemEntityName = require('@bem/sdk.entity-name');
const BemCell = require('@bem/sdk.cell');

const VertexSet = require('../lib/vertex-set');

describe('vertex-set.test.js', () => {
    it('should add different vertices', () => {
        const set = new VertexSet();
        const vertex1 = new BemCell({ entity: new BemEntityName({ block: 'input' }) });
        const vertex2 = new BemCell({ entity: new BemEntityName({ block: 'button' }) });

        set.add(vertex1).add(vertex2);

        expect(set.size).to.equal(2);
    });

    it('should not add equal vertex', () => {
        const set = new VertexSet();
        const entity = new BemEntityName({ block: 'input' });
        const vertex1 = new BemCell({ entity });
        const vertex2 = new BemCell({ entity });

        set.add(vertex1).add(vertex2);

        expect(set.size).to.equal(1);
    });
});
