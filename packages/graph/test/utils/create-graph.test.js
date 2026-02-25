import { expect } from 'chai';

import { createGraph, createVertex } from '../../lib/test-utils.js';

const depsOfGraph = (s, decl, tech) => createGraph(s)
    .dependenciesOf(decl, tech)
    .map(v => createVertex(v.entity, v.tech).id);

describe('utils/create-graph.test.js', () => {
    it('should create simple graph', () => {
        expect(depsOfGraph('a => b', {block: 'a'})).to.deep.equal(['b', 'a']);
    });

    it('should create and resolve cyclic graph', () => {
        const decl = depsOfGraph('a => b -> c -> d => a', {block: 'a'});

        const indexA = decl.indexOf('a');
        const indexB = decl.indexOf('b');
        const indexD = decl.indexOf('d');

        expect(indexB < indexA).to.be.true;
        expect(indexA < indexD).to.be.true;
    });

    it('should create and resolve another cyclic graph', () => {
        expect(depsOfGraph('a -> a__e => a => b, a => c', {block: 'a__e'})).to.deep.equal(['b', 'c', 'a', 'a__e']);
    });
});
