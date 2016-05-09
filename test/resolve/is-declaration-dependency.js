var expect = require('chai').expect;

import isDeclarationDependency from '../../lib/resolve/is-declaration-dependency';

describe('resolve::isDeclarationDependency()', function () {
    it('should not detect dependency if required tech is not specified', function () {
        var dependent = {
                entity: { block: 'A' },
                tech: 'css'
            },
            dependency = {
                entity: { block: 'B' },
                tech: 'css'
            };

        expect(isDeclarationDependency(dependent.tech, dependency.tech)).to.be.false;
    });

    it('should not detect dependency if dependency tech is not specified', function () {
        var dependent = {
                entity: { block: 'A' },
                tech: 'css'
            },
            dependency = {
                entity: { block: 'B' }
            };

        expect(isDeclarationDependency(dependent.tech, dependency.tech, 'css')).to.be.false;
    });

    it('should detect dependency if dependant tech not coincides with dependency tech', function () {
        var dependent = {
                entity: { block: 'A' },
                tech: 'css'
            },
            dependency = {
                entity: { block: 'B' },
                tech: 'js'
            };

        expect(isDeclarationDependency(dependent.tech, dependency.tech, 'css')).to.be.true;
    });

    it('should detect dependency if dependancy tech not coincides with required tech', function () {
        var dependent = {
                entity: { block: 'A' }
            },
            dependency = {
                entity: { block: 'B' },
                tech: 'js'
            };

        expect(isDeclarationDependency(dependent.tech, dependency.tech, 'css')).to.be.true;
    });
});
