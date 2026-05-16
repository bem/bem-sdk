import { expect } from 'chai';

import { patternParser } from './index.js';

describe('pattern-parser', () => {
  it('throws on incorrect pattern', () => {
    expect(() => patternParser('qwe} {layer} $ ${entity?')).to.throw(
      /Unclosed paren/,
    );
  });

  it('parses simple pattern', () => {
    expect(patternParser('${layer}.blocks/${entity}.${tech}')).to.deep.equal([
      '',
      'layer',
      '.blocks/',
      'entity',
      '.',
      'tech',
    ]);
  });

  it('parses complex pattern', () => {
    expect(patternParser('${entity}${layer?@${layer}}.${tech}')).to.deep.equal([
      '',
      'entity',
      '',
      ['layer', '@', 'layer'],
      '.',
      'tech',
    ]);
  });

  it('parses recursive pattern', () => {
    expect(
      patternParser(
        '${entity?${entity}${layer?@${layer}${tech?.${tech}-foo}_bar}.baz}',
      ),
    ).to.deep.equal([
      '',
      [
        'entity',
        '',
        'entity',
        '',
        ['layer', '@', 'layer', '', ['tech', '.', 'tech', '-foo'], '_bar'],
        '.baz',
      ],
    ]);
  });
});
