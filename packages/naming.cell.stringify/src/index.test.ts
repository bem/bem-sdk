import { expect } from 'chai';

import cellStringify, { type BemCellLike } from './index.js';

const cell = (data: Partial<BemCellLike> & { entity: BemCellLike['entity'] }): BemCellLike => ({
  tech: 'css',
  ...data,
});

describe('cell.stringify', () => {
  it('throws on missing convention', () => {
    expect(() => cellStringify(undefined as unknown as Parameters<typeof cellStringify>[0]))
      .to.throw(/convention object required/);
  });

  it('throws on missing fs.pattern', () => {
    expect(() =>
      cellStringify({ fs: { scheme: 'flat' } } as unknown as Parameters<typeof cellStringify>[0]),
    ).to.throw(/fs\.pattern field required/);
  });

  it('throws when stringifying cell without tech', () => {
    const stringify = cellStringify({
      fs: { scheme: 'flat', pattern: '${layer}.blocks/${entity}.${tech}' },
    });
    expect(() => stringify(cell({ entity: { block: 'button' }, tech: undefined })))
      .to.throw(/tech field required/);
  });

  it('uses simple pattern with default layer fallback', () => {
    const stringify = cellStringify({
      fs: { scheme: 'flat', pattern: '${layer}.blocks/${entity}.${tech}' },
    });
    expect(stringify(cell({ entity: { block: 'button' } })))
      .to.equal('common.blocks/button.css');
  });

  it('drops layer placeholder via defaultLayer', () => {
    const stringify = cellStringify({
      fs: {
        scheme: 'flat',
        pattern: '${entity}${layer?@${layer}}.${tech}',
        defaultLayer: 'common',
      },
    });
    expect(stringify(cell({ entity: { block: 'button' } }))).to.equal('button.css');
    expect(stringify(cell({ entity: { block: 'button' }, layer: 'desktop' })))
      .to.equal('button@desktop.css');
  });

  it('renders nested scheme with elem and mod folders', () => {
    const stringify = cellStringify({
      fs: {
        scheme: 'nested',
        pattern: '${entity}${layer?@${layer}}.${tech}',
        defaultLayer: 'common',
      },
    });

    expect(
      stringify(cell({ entity: { block: 'button', elem: 'text' }, layer: 'desktop' })),
    ).to.equal('button/__text/button__text@desktop.css');

    expect(
      stringify(cell({ entity: { block: 'button', mod: 'raised' } })),
    ).to.equal('button/_raised/button_raised.css');
  });

  it('respects fs.delims overrides', () => {
    const stringify = cellStringify({
      fs: {
        scheme: 'flat',
        pattern: '${entity}.${tech}',
        delims: { elem: '$$$', mod: { name: '##' } },
      },
    });
    expect(
      stringify(cell({ entity: { block: 'b', elem: 'e', mod: { name: 'm', val: 'v' } } })),
    ).to.equal('b$$$e##m##v.css');
  });

  it('falls back to root delims when fs.delims is empty', () => {
    const stringify = cellStringify({
      delims: { elem: '~', mod: { name: '!', val: '!' } },
      fs: { scheme: 'flat', pattern: '${entity}.${tech}', delims: { mod: {} } },
    });
    expect(
      stringify(cell({ entity: { block: 'b', elem: 'e', mod: { name: 'm', val: 'v' } } })),
    ).to.equal('b~e!m!v.css');
  });

  it('replaces unknown placeholders with empty string', () => {
    const stringify = cellStringify({
      fs: { scheme: 'flat', pattern: '${layer}.blocks/${non-sense}${entity}.${tech}' },
    });
    expect(stringify(cell({ entity: { block: 'button' } })))
      .to.equal('common.blocks/button.css');
  });
});
