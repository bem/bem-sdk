const assert = require('assert');
const resolveSets = require('../lib/resolve-sets');

describe('resolve-sets', function() {
    it('should support objects', function() {
        assert.deepEqual(
            resolveSets({ setName: { layer: 'one' } }),
            { setName: [{ layer: 'one' }] }
        );
    });

    it('should support arrays', function() {
        assert.deepEqual(
            resolveSets({ setName: [{ layer: 'one' }, { layer: 'two' }] }),
            { setName: [{ layer: 'one' }, { layer: 'two' }] }
        );
    });

    it('should resolve layers', function() {
        assert.deepEqual(
            resolveSets({ setName: 'one two' }),
            { setName: [{ layer: 'one' }, { layer: 'two' }] }
        );
    });

    it('should resolve sets', function() {
        assert.deepEqual(
            resolveSets({
                setName: 'setName2@ common blah some-layer',
                setName2: 'common desktop blah'
            }),
            {
                setName: [{ layer: 'common' }, { layer: 'desktop' }, { layer: 'blah' }, { layer: 'some-layer' }],
                setName2: [{ layer: 'common' }, { layer: 'desktop' }, { layer: 'blah' }]
            }
        );
    });

    it('should handle recoursive ');

    it('should throw if set depends on self');

    it('should throw error unless set found', function() {
        assert.throws(() => resolveSets({ setName: 'not-existed@' }), /Set `not-existed` was not found/);
    });

    describe('libs', function() {
        it('should resolve lib layers', function() {
            assert.deepEqual(
                resolveSets({ setName: '@lib1/layer1' }),
                { setName: [{ library: 'lib1', layer: 'layer1' }] }
            );
        });

        it('should resolve lib sets', function() {
            assert.deepEqual(
                resolveSets({ setName: 'set1@lib1' }),
                { setName: [{ library: 'lib1', set: 'set1' }] }
            );
        });

        it('should resolve lib on current layer', function() {
            assert.deepEqual(
                resolveSets({ setName: '@lib1' }),
                { setName: [{ library: 'lib1', set: 'setName' }] }
            );
        });
    });
});
