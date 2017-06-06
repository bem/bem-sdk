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
            [linkMethod]({ block: 'B' }, 'js'); // eslint-disable-line no-unexpected-multiline

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf([{ block: 'A' }], 'css'));

        expect(decl).to.contain({ entity: { block: 'B' }, tech: 'js' });
    }
});

test('should resolve tech depending on multiple techs', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' }, 'js') // eslint-disable-line no-unexpected-multiline
            [linkMethod]({ block: 'B' }, 'bemhtml'); // eslint-disable-line no-unexpected-multiline

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf([{ block: 'A' }], 'css'));

        expect(decl).to.contain({ entity: { block: 'B' }, tech: 'bemhtml' })
            .and.to.contain({ entity: { block: 'B' }, tech: 'js' });
    }
});

// TODO: move to transitive
test('should resolve tech dependency depending on tech different with resolving in another entity', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            [linkMethod]({ block: 'B' }, 'css'); // eslint-disable-line no-unexpected-multiline

        graph
            .vertex({ block: 'B' })
            [linkMethod]({ block: 'C' }, 'js'); // eslint-disable-line no-unexpected-multiline

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf([{ block: 'A' }], 'css'));

        expect(decl).to.contain({ entity: { block: 'C' }, tech: 'js' });
    }
});

test('should resolve tech dependency depending on tech different from resolving tech', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            [linkMethod]({ block: 'B' }, 'css'); // eslint-disable-line no-unexpected-multiline

        graph
            .vertex({ block: 'B' })
            [linkMethod]({ block: 'C' }, 'bemhtml') // eslint-disable-line no-unexpected-multiline
            [linkMethod]({ block: 'D' }, 'js'); // eslint-disable-line no-unexpected-multiline

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.contain({ entity: { block: 'C' }, tech: 'bemhtml' })
            .to.contain({ entity: { block: 'D' }, tech: 'js' });
    }
});

test('should include tech to result once if tech of multiple entities depends on this tech and this tech is' +
    ' not matching with resolving tech', macro, {
        graph: (linkMethod) => {
            const graph = new BemGraph();

            graph
                .vertex({ block: 'A' }, 'css')
                [linkMethod]({ block: 'C' }, 'js'); // eslint-disable-line no-unexpected-multiline

            graph
                .vertex({ block: 'B' }, 'css')
                [linkMethod]({ block: 'C' }, 'js'); // eslint-disable-line no-unexpected-multiline

            return graph;
        },
        test: (t, graph) => {
            const decl = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'B' }], 'css'));

            const firstIndex = findIndex(decl, { entity: { block: 'C' }, tech: 'js' });
            const lastIndex = findLastIndex(decl, { entity: { block: 'C' }, tech: 'js' });

            expect(firstIndex).to.not.be.equal(-1);
            expect(firstIndex).to.be.equal(lastIndex);
        }
});
