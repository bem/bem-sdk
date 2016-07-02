'use strict';

const test = require('ava');
const expect = require('chai').expect;

const BemGraph = lib.BemGraph;
const macro = utils.depsMacro;

test('should not include entity if no entity from decl depends on it and this entity has dependency on entity' +
    ' listed in decl', macro, {
        graph: (linkMethod) => {
            const graph = new BemGraph();

            graph
                .vertex({ block: 'B' })
                [linkMethod]({ block: 'A' }, 'css'); // eslint-disable-line no-unexpected-multiline

            return graph;
        },
        test: (t, graph) => {
            const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

            expect(decl).not.to.contain({ entity: { block: 'B' }, tech: 'css' });
        }
});

test('should not include dependency if no entity from decl\'s dependencies depends on it', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'C' })
            [linkMethod]({ block: 'D' }, 'css'); // eslint-disable-line no-unexpected-multiline

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).not.to.contain({ entity: { block: 'D' }, tech: 'css' });
    }
});
