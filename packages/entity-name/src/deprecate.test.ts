import { expect } from 'chai';

import {
  _resetDeprecationCacheForTests,
  deprecate,
  emitDeprecation,
} from './deprecate.js';
import { BemEntityName } from './entity-name.js';

describe('deprecate', () => {
  beforeEach(() => {
    _resetDeprecationCacheForTests();
  });

  it('should emit deprecation event for a plain object', (done) => {
    const onDeprecation = (err: unknown): void => {
      const message = (err as Error).message;
      expect(message).to.contain('`oldField` is kept just for compatibility');
      expect(message).to.contain('Use `newField` instead in `{ block: \'block\' }`');
      process.removeListener('deprecation', onDeprecation);
      done();
    };
    process.on('deprecation', onDeprecation);

    deprecate({ block: 'block' }, 'oldField', 'newField');
  });

  it('should emit deprecation event for a BemEntityName instance', (done) => {
    const onDeprecation = (err: unknown): void => {
      const message = (err as Error).message;
      expect(message).to.contain('Use `newField` instead in `BemEntityName { block: \'block\' }`');
      process.removeListener('deprecation', onDeprecation);
      done();
    };
    process.on('deprecation', onDeprecation);

    deprecate(new BemEntityName({ block: 'block' }), 'oldField', 'newField');
  });

  it('should dedupe equal messages', () => {
    let count = 0;
    const onDeprecation = (): void => {
      count += 1;
    };
    process.on('deprecation', onDeprecation);
    try {
      emitDeprecation('once');
      emitDeprecation('once');
      emitDeprecation('twice');
    } finally {
      process.removeListener('deprecation', onDeprecation);
    }

    expect(count).to.equal(2);
  });
});
