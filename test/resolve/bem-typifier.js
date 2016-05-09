var expect = require('chai').expect;

import BemTypifier from '../../lib/resolve/bem-typifier';

describe('resolve::BemTypifier()', function () {
    describe('constructor', function () {
        it('should return empty array with blocks', function () {
            var typifier = new BemTypifier();

            expect(Array.from(typifier.blocks())).to.be.deep.equal([]);
        });

        it('should return empty array with modificators of blocks', function () {
            var typifier = new BemTypifier();

            expect(Array.from(typifier.blockModificators())).to.be.deep.equal([]);
        });

        it('should return empty array with elements', function () {
            var typifier = new BemTypifier();

            expect(Array.from(typifier.elements())).to.be.deep.equal([]);
        });

        it('should return empty array with modificators of elements', function () {
            var typifier = new BemTypifier();

            expect(Array.from(typifier.elementModificators())).to.be.deep.equal([]);
        });
    });

    describe('typify', function () {
        it('should typify block', function () {
            var typifier = new BemTypifier(),
                entity = { block: 'A' };

            typifier.typify(entity);

            expect(Array.from(typifier.blocks())).to.be.include(entity);
        });

        it('should typify modificator of block', function () {
            var typifier = new BemTypifier(),
                entity = { block: 'A', modName: 'm' };

            typifier.typify(entity);

            expect(Array.from(typifier.blockModificators())).to.be.include(entity);
        });

        it('should typify element', function () {
            var typifier = new BemTypifier(),
                entity = { block: 'A', elem: 'e' };

            typifier.typify(entity);

            expect(Array.from(typifier.elements())).to.be.include(entity);
        });

        it('should typify modificator of element', function () {
            var typifier = new BemTypifier(),
                entity = { block: 'A', elem: 'e', modName: 'm' };

            typifier.typify(entity);

            expect(Array.from(typifier.elementModificators())).to.be.include(entity);
        });
    });

    describe('set', function () {
        it('should add same block only once', function () {
            var typifier = new BemTypifier(),
                entity = { block: 'A' };

            typifier.typify(entity);
            typifier.typify(entity);

            expect(Array.from(typifier.blocks())).to.be.deep.equal([entity]);
        });

        it('should add same modificator of block only once', function () {
            var typifier = new BemTypifier(),
                entity = { block: 'A', modName: 'm' };

            typifier.typify(entity);
            typifier.typify(entity);

            expect(Array.from(typifier.blockModificators())).to.be.deep.equal([entity]);
        });

        it('should add same element only once', function () {
            var typifier = new BemTypifier(),
                entity = { block: 'A', elem: 'e' };

            typifier.typify(entity);
            typifier.typify(entity);

            expect(Array.from(typifier.elements())).to.be.deep.equal([entity]);
        });

        it('should add same modificator of element only once', function () {
            var typifier = new BemTypifier(),
                entity = { block: 'A', elem: 'e', modName: 'm' };

            typifier.typify(entity);
            typifier.typify(entity);

            expect(Array.from(typifier.elementModificators())).to.be.deep.equal([entity]);
        });
    });
});
