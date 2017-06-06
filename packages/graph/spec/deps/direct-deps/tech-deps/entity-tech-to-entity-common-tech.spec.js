'use strict';

const test = require('ava');
const expect = require('chai').expect;

const BemGraph = lib.BemGraph;
const macro = utils.depsMacro;
const findIndex = utils.findIndex;
const findLastIndex = utils.findLastIndex;

test('should resolve entity depending on another entity', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' }); // eslint-disable-line no-unexpected-multiline

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.contain({ entity: { block: 'B' }, tech: 'css' });
    }
});

test('should resolve entity depending on multiple entities', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' }) // eslint-disable-line no-unexpected-multiline
            [linkMethod]({ block: 'C' }); // eslint-disable-line no-unexpected-multiline

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.contain({ entity: { block: 'B' }, tech: 'css' })
            .to.contain({ entity: { block: 'C' }, tech: 'css' });
    }
});

test('should resolve multiple techs in entity depending on another entity', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' }); // eslint-disable-line no-unexpected-multiline

        graph
            .vertex({ block: 'A' }, 'js')
            [linkMethod]({ block: 'B' }); // eslint-disable-line no-unexpected-multiline

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.contain({ entity: { block: 'B' }, tech: 'css' });
    }
});

test('should include entity to result once if multiple entities depend on this entity', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'C' }); // eslint-disable-line no-unexpected-multiline

        graph
            .vertex({ block: 'B' }, 'css')
            [linkMethod]({ block: 'C' }); // eslint-disable-line no-unexpected-multiline

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'B' }], 'css'));

        const firstIndex = findIndex(decl, { entity: { block: 'C' }, tech: 'css' });
        const lastIndex = findLastIndex(decl, { entity: { block: 'C' }, tech: 'css' });

        expect(firstIndex).to.not.be.equal(-1);
        expect(firstIndex).to.be.equal(lastIndex);
    }
});
