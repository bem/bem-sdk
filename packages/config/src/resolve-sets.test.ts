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

  describe('library layer references (#262)', () => {
    it('should treat `@lib/layer name` as library layer + local layer', () => {
      assert.deepEqual(resolveSets({ desktop: '@foo-lib/common common' }), {
        desktop: [
          { library: 'foo-lib', layer: 'common' },
          { layer: 'common' },
        ],
      });
    });

    it('should reject `set@lib/layer` form with a clear message', () => {
      assert.throws(
        () => resolveSets({ setName: 'set1@lib1/layer1' }),
        /`set@lib\/layer` form is not supported/,
      );
    });
  });

  describe('verbose sets (#246)', () => {
    it('should accept array of objects with mixed chunk kinds', () => {
      assert.deepEqual(
        resolveSets({
          'touch-phone': [
            { library: 'bem-components', set: 'touch-phone' },
            { layer: 'common' },
            { layer: 'touch' },
            { layer: 'touch-phone' },
          ],
        }),
        {
          'touch-phone': [
            { library: 'bem-components', set: 'touch-phone' },
            { layer: 'common' },
            { layer: 'touch' },
            { layer: 'touch-phone' },
          ],
        },
      );
    });

    it('should expand `{ set }` local references inside an array', () => {
      assert.deepEqual(
        resolveSets({
          desktop: [
            { library: 'bem-components', set: 'desktop' },
            { set: 'common' },
          ],
          common: 'common',
        }),
        {
          desktop: [
            { library: 'bem-components', set: 'desktop' },
            { layer: 'common' },
          ],
          common: [{ layer: 'common' }],
        },
      );
    });

    it('should accept mixed string and object items in one array', () => {
      assert.deepEqual(
        resolveSets({
          setName: ['common', { library: 'bem-components', set: 'common' }, '@touch'],
        }),
        {
          setName: [
            { layer: 'common' },
            { library: 'bem-components', set: 'common' },
            { library: 'touch', set: 'setName' },
          ],
        },
      );
    });

    it('should keep `{ library, layer }` library layer chunk as-is', () => {
      assert.deepEqual(
        resolveSets({
          setName: [{ library: 'bem-components', layer: 'common' }],
        }),
        { setName: [{ library: 'bem-components', layer: 'common' }] },
      );
    });

    it('should throw on empty chunk object', () => {
      assert.throws(
        () => resolveSets({ setName: [{}] }),
        /must define at least one of `layer`, `set`, `library`/,
      );
    });

    it('should throw when set and layer are combined in one chunk', () => {
      assert.throws(
        () => resolveSets({ setName: [{ set: 'a', layer: 'b' }] }),
        /`set` and `layer` are mutually exclusive/,
      );
    });

    it('should throw on a missing local `{ set }` reference', () => {
      assert.throws(
        () => resolveSets({ setName: [{ set: 'nope' }] }),
        /Set `nope` was not found/,
      );
    });
  });
});
