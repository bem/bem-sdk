import { expect } from 'chai';

import bemDecl, {
  intersect,
  merge,
  normalize,
  parse,
  subtract,
  format,
  stringify,
  load,
  save,
  assign,
} from './index.js';

describe('public surface', () => {
  it('exposes named exports', () => {
    for (const fn of [intersect, merge, normalize, parse, subtract, format, stringify, load, save, assign]) {
      expect(fn).to.be.a('function');
    }
  });

  it('exposes default export with all members', () => {
    for (const k of [
      'normalize',
      'merge',
      'subtract',
      'intersect',
      'parse',
      'assign',
      'load',
      'stringify',
      'save',
      'format',
    ]) {
      expect((bemDecl as Record<string, unknown>)[k]).to.be.a('function');
    }
  });
});
