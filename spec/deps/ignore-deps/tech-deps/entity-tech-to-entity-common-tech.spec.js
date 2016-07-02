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
                .vertex({ block: 'B' }, 'css')
                [linkMethod]({ block: 'A' }); // eslint-disable-line no-unexpected-multiline

            return graph;
        },
        test: (t, graph) => {
            const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

            expect(decl).to.not.contain({ entity: { block: 'B' }, tech: 'css' });
        }
});

test('should not include dependency if no entity from decl\'s dependencies depends on it', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'C' }, 'css')
            [linkMethod]({ block: 'D' }); // eslint-disable-line no-unexpected-multiline

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.not.contain({ entity: { block: 'D' }, tech: 'css' });
    }
});
