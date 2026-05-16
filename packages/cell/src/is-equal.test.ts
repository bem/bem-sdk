import { expect } from 'chai';

import { BemCell } from './cell.js';

describe('isEqual', () => {
  it('detects equal cells', () => {
    const a = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
    const b = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
    expect(a.isEqual(b)).to.equal(true);
  });

  it('detects entity differences', () => {
    const a = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
    const b = BemCell.create({ block: 'input', tech: 'css', layer: 'desktop' });
    expect(a.isEqual(b)).to.equal(false);
  });

  it('detects different field sets', () => {
    const a = BemCell.create({ block: 'button', tech: 'css' });
    const b = BemCell.create({ block: 'button', layer: 'desktop' });
    expect(a.isEqual(b)).to.equal(false);
  });

  it('detects missing tech', () => {
    const a = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
    const b = BemCell.create({ block: 'button', layer: 'desktop' });
    expect(a.isEqual(b)).to.equal(false);
  });

  it('detects missing layer', () => {
    const a = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
    const b = BemCell.create({ block: 'button', tech: 'css' });
    expect(a.isEqual(b)).to.equal(false);
  });

  it('detects entity-only cell mismatch', () => {
    const a = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
    const b = BemCell.create({ block: 'button' });
    expect(a.isEqual(b)).to.equal(false);
  });

  it('treats both empty cells as equal', () => {
    const a = BemCell.create({ block: 'button' });
    const b = BemCell.create({ block: 'button' });
    expect(a.isEqual(b)).to.equal(true);
  });

  it('detects tech difference', () => {
    const a = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
    const b = BemCell.create({ block: 'button', tech: 'js', layer: 'desktop' });
    expect(a.isEqual(b)).to.equal(false);
  });

  it('detects layer difference', () => {
    const a = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
    const b = BemCell.create({ block: 'button', tech: 'css', layer: 'touch' });
    expect(a.isEqual(b)).to.equal(false);
  });
});
