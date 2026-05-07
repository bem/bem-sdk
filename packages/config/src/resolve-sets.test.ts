import { strict as assert } from 'node:assert';

import { resolveSets } from './index.js';

describe('resolve-sets', () => {
  it('should support objects', () => {
    assert.deepEqual(resolveSets({ setName: { layer: 'one' } }), {
      setName: [{ layer: 'one' }],
    });
  });

  it('should support arrays', () => {
    assert.deepEqual(
      resolveSets({ setName: [{ layer: 'one' }, { layer: 'two' }] }),
      { setName: [{ layer: 'one' }, { layer: 'two' }] },
    );
  });

  it('should resolve layers', () => {
    assert.deepEqual(resolveSets({ setName: 'one two' }), {
      setName: [{ layer: 'one' }, { layer: 'two' }],
    });
  });

  it('should resolve sets', () => {
    assert.deepEqual(
      resolveSets({
        setName: 'setName2@ common blah some-layer',
        setName2: 'common desktop blah',
      }),
      {
        setName: [
          { layer: 'common' },
          { layer: 'desktop' },
          { layer: 'blah' },
          { layer: 'some-layer' },
        ],
        setName2: [
          { layer: 'common' },
          { layer: 'desktop' },
          { layer: 'blah' },
        ],
      },
    );
  });

  it('should throw error unless set found', () => {
    assert.throws(
      () => resolveSets({ setName: 'not-existed@' }),
      /Set `not-existed` was not found/,
    );
  });

  describe('libs', () => {
    it('should resolve lib layers', () => {
      assert.deepEqual(resolveSets({ setName: '@lib1/layer1' }), {
        setName: [{ library: 'lib1', layer: 'layer1' }],
      });
    });

    it('should resolve lib sets', () => {
      assert.deepEqual(resolveSets({ setName: 'set1@lib1' }), {
        setName: [{ library: 'lib1', set: 'set1' }],
      });
    });

    it('should resolve lib on current layer', () => {
      assert.deepEqual(resolveSets({ setName: '@lib1' }), {
        setName: [{ library: 'lib1', set: 'setName' }],
      });
    });
  });
});
