'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../lib').BemGraph;

describe('loops/tech-loops', () => {
    it('should throw error if detected ordered loop between same techs', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            .dependsOn({ block: 'B' }, 'css');

        graph
            .vertex({ block: 'B' }, 'css')
            .dependsOn({ block: 'A' }, 'css');

        expect(() => graph.dependenciesOf({ block: 'A' }, 'css')).to.throw();

        try {
            graph.dependenciesOf({ block: 'A' }, 'css');
        } catch (error) {
            expect(error.loop).to.deep.equal([
                { entity: { block: 'A' } },
                { entity: { block: 'B' }, tech: 'css' },
                { entity: { block: 'A' }, tech: 'css' },
                { entity: { block: 'B' }, tech: 'css' }
            ]);
        }
    });

    it('should not throw error if detected loop between different techs', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'js')
            .dependsOn({ block: 'B' }, 'bemhtml');

        graph
            .vertex({ block: 'B' }, 'js')
            .dependsOn({ block: 'A' }, 'bemhtml');

        expect(() => graph.dependenciesOf({ block: 'A' }, 'js')).to.not.throw();
    });

    it('should throw error if detected loop between common and specific techs', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'B' });

        graph
            .vertex({ block: 'B' })
            .dependsOn({ block: 'A' }, 'css');

        expect(() => graph.dependenciesOf({ block: 'A' }));

        try {
            graph.dependenciesOf({ block: 'A' });
        } catch (error) {
            expect(error.loop).to.deep.equal([
                { entity: { block: 'A' } },
                { entity: { block: 'B' } },
                { entity: { block: 'A' }, tech: 'css' },
                { entity: { block: 'B' }, tech: 'css' },
                { entity: { block: 'A' }, tech: 'css' }
            ]);
        }
    });

    it('should throw error if detected loop between common and other techs', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'B' });

        graph
            .vertex({ block: 'B' })
            .dependsOn({ block: 'A' }, 'css');

        expect(() => graph.dependenciesOf({ block: 'A' }, 'css'));

        try {
            graph.dependenciesOf({ block: 'A' }, 'css');
        } catch (error) {
            expect(error.loop).to.deep.equal([
                { entity: { block: 'A' } },
                { entity: { block: 'B' }, tech: 'css' },
                { entity: { block: 'A' }, tech: 'css' },
                { entity: { block: 'B' }, tech: 'css' }
            ]);
        }
    });

    it('should not throw error if detected loop on itself with other tech', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            .dependsOn({ block: 'A' }, 'js');

        graph
            .vertex({ block: 'A' })
            .linkWith({ block: 'A' }, 'css');

        expect(() => graph.dependenciesOf({ block: 'A' }, 'css')).to.not.throw();
    });
});
