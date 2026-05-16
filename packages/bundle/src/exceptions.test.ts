import { expect } from 'chai';

import { BemBundle } from './index.js';

describe('throw exception', () => {
  it('should throw if no bemjson and bemdecl given', () => {
    expect(() => {
      new BemBundle({} as never);
    }).to.throw(Error, 'BEMJSON or BEMDECL must be present');
  });

  it('should throw if bemjson not an object', () => {
    expect(() => {
      new BemBundle({
        bemjson: 'bemjson' as never,
      } as never);
    }).to.throw(Error, 'BEMJSON should be an object');
  });

  it('should throw if levels given but not an array', () => {
    expect(() => {
      new BemBundle({
        bemjson: {
          block: 'block',
        },
        levels: 'desktop.blocks' as never,
      } as never);
    }).to.throw(Error, 'Levels must be array of string');
  });

  it('should throw if no path and name given', () => {
    expect(() => {
      new BemBundle({
        bemjson: {
          block: 'block',
        },
      });
    }).to.throw(Error, 'Bundle name or path must be present');
  });
});
