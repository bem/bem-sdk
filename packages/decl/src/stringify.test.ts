import { expect } from 'chai';
import JSON5 from 'json5';

import { BemCell } from '@bem/sdk.cell';

import { stringify } from './stringify.js';

const obj = {
  format: 'enb',
  deps: [{ block: 'block', elem: 'elem', mod: 'mod', val: 'val' }],
};
// Silence deprecation prints from `modName`/`modVal` legacy fields.
const noop = (): void => {};
process.on('deprecation', noop);

const cell = BemCell.create({
  block: 'block',
  elem: 'elem',
  modName: 'mod',
  modVal: 'val',
});

describe('stringify (errors)', () => {
  it('throws if no format given', () => {
    expect(() => stringify(cell)).to.throw('You must declare target format');
  });

  it('throws on unsupported format', () => {
    expect(() => stringify(cell, { format: 'unsupported' as never })).to.throw(
      "Specified format isn't supported",
    );
  });

  it('throws on unsupported exportType', () => {
    expect(() =>
      stringify(cell, { format: 'enb', exportType: 'unsupported' as never }),
    ).to.throw("Specified export type isn't supported");
  });
});

describe('stringify (enb)', () => {
  it('renders commonjs', () => {
    expect(stringify(cell, { format: 'enb', exportType: 'commonjs' })).to.equal(
      `module.exports = ${JSON5.stringify(obj, null, 4)};\n`,
    );
  });

  it('renders es6', () => {
    expect(stringify(cell, { format: 'enb', exportType: 'es6' })).to.equal(
      `export default ${JSON5.stringify(obj, null, 4)};\n`,
    );
  });

  it('renders es2015', () => {
    expect(stringify(cell, { format: 'enb', exportType: 'es2015' })).to.equal(
      `export default ${JSON5.stringify(obj, null, 4)};\n`,
    );
  });

  it('renders json', () => {
    expect(stringify(cell, { format: 'enb', exportType: 'json' })).to.equal(
      JSON.stringify(obj, null, 4),
    );
  });

  it('renders json5', () => {
    expect(stringify(cell, { format: 'enb', exportType: 'json5' })).to.equal(
      JSON5.stringify(obj, null, 4),
    );
  });

  it('defaults to json exportType', () => {
    expect(stringify(cell, { format: 'enb' })).to.equal(
      JSON.stringify(obj, null, 4),
    );
  });
});
