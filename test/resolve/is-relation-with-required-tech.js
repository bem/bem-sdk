import { expect } from 'chai';
import isRelationWithRequiredTech from '../../lib/resolve/is-relation-with-required-tech';

describe('resolve::isRelationWithRequiredTech()', function () {
    it('should detect relation if required tech is not specified', function () {
        var relation = {
            entity: { block: 'A' },
            dependOn: {
                entity: { block: 'B' }
            }
        };

        expect(isRelationWithRequiredTech(relation)).to.be.true;
    });

    it('should detect relation if dependent has common dependency', function () {
        var relation = {
            entity: { block: 'A' },
            dependOn: {
                entity: { block: 'B' }
            }
        };

        expect(isRelationWithRequiredTech(relation, 'css')).to.be.true;
    });

    it('should detect relation if required tech coincides with dependent tech', function () {
        var relation = {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: {
                entity: { block: 'B' }
            }
        };

        expect(isRelationWithRequiredTech(relation, 'css')).to.be.true;
    });

    it('should not detect relation if required tech not coincides with dependent tech', function () {
        var relation = {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: {
                entity: { block: 'B' }
            }
        };

        expect(isRelationWithRequiredTech(relation, 'js')).to.be.false;
    });
});
