import { expect } from 'chai';

import { BemFile } from '@bem/sdk.file';

import { fileStringifyWrapper } from './index.js';

const f = (
  cell: ConstructorParameters<typeof BemFile>[0]['cell'],
  level?: string,
): BemFile => new BemFile(level == null ? { cell } : { cell, level });

const button = f({ block: 'button', tech: 'css' });
const buttonCommon = f({ block: 'button', layer: 'common', tech: 'css' });
const buttonDesktop = f({ block: 'button', layer: 'desktop', tech: 'css' });
const buttonTextDesktop = f({ block: 'button', elem: 'text', layer: 'desktop', tech: 'css' });
const raisedButton = f({ block: 'button', mod: 'raised', tech: 'css' });
const raisedButtonDesktop = f({ block: 'button', mod: 'raised', layer: 'desktop', tech: 'css' });

const buttonCommonCore = f({ block: 'button', layer: 'common', tech: 'css' }, 'a/bem-core/b');
const buttonDesktopCore = f({ block: 'button', layer: 'desktop', tech: 'css' }, 'a/bem-core/b');
const buttonTextDesktopCore = f(
  { block: 'button', elem: 'text', layer: 'desktop', tech: 'css' },
  'a/bem-core/b',
);
const raisedButtonCore = f({ block: 'button', mod: 'raised', tech: 'css' }, 'a/bem-core/b');
const raisedButtonDesktopCore = f(
  { block: 'button', mod: 'raised', layer: 'desktop', tech: 'css' },
  'a/bem-core/b',
);

describe('file.stringify', () => {
  it('stringifies file w/o layer with simple pattern', () => {
    const stringify = fileStringifyWrapper({
      fs: { scheme: 'flat', pattern: '${layer}.blocks/${entity}.${tech}' },
    });
    expect(stringify(button)).to.equal('common.blocks/button.css');
  });

  it('skips unknown ${vars}', () => {
    const stringify = fileStringifyWrapper({
      fs: { scheme: 'flat', pattern: '${layer}.blocks/${non-sence}${entity}.${tech}' },
    });
    expect(stringify(button)).to.equal('common.blocks/button.css');
  });

  it('stringifies layered files with simple pattern', () => {
    const stringify = fileStringifyWrapper({
      fs: { scheme: 'flat', pattern: '${layer}.blocks/${entity}.${tech}' },
    });
    expect(stringify(buttonCommon)).to.equal('common.blocks/button.css');
    expect(stringify(buttonDesktop)).to.equal('desktop.blocks/button.css');
  });

  it('stringifies layered files with conditional pattern', () => {
    const stringify = fileStringifyWrapper({
      fs: { scheme: 'flat', pattern: '${entity}${layer?@${layer}}.${tech}' },
    });
    expect(stringify(buttonCommon)).to.equal('button@common.css');
    expect(stringify(buttonDesktop)).to.equal('button@desktop.css');
  });

  it('respects defaultLayer (flat)', () => {
    const stringify = fileStringifyWrapper({
      fs: {
        scheme: 'flat',
        pattern: '${entity}${layer?@${layer}}.${tech}',
        defaultLayer: 'common',
      },
    });
    expect(stringify(buttonCommon)).to.equal('button.css');
    expect(stringify(buttonDesktop)).to.equal('button@desktop.css');
    expect(stringify(buttonTextDesktop)).to.equal('button__text@desktop.css');
    expect(stringify(raisedButton)).to.equal('button_raised.css');
    expect(stringify(raisedButtonDesktop)).to.equal('button_raised@desktop.css');
  });

  it('renders nested scheme', () => {
    const stringify = fileStringifyWrapper({
      fs: {
        scheme: 'nested',
        pattern: '${entity}${layer?@${layer}}.${tech}',
        defaultLayer: 'common',
      },
    });
    expect(stringify(buttonCommon)).to.equal('button/button.css');
    expect(stringify(buttonDesktop)).to.equal('button/button@desktop.css');
    expect(stringify(buttonTextDesktop)).to.equal(
      'button/__text/button__text@desktop.css',
    );
    expect(stringify(raisedButton)).to.equal('button/_raised/button_raised.css');
    expect(stringify(raisedButtonDesktop)).to.equal(
      'button/_raised/button_raised@desktop.css',
    );
  });

  it('prefixes nested-scheme output with level', () => {
    const stringify = fileStringifyWrapper({
      fs: {
        scheme: 'nested',
        pattern: '${entity}${layer?@${layer}}.${tech}',
        defaultLayer: 'common',
      },
    });
    expect(stringify(buttonCommonCore)).to.equal('a/bem-core/b/button/button.css');
    expect(stringify(buttonDesktopCore)).to.equal('a/bem-core/b/button/button@desktop.css');
    expect(stringify(buttonTextDesktopCore)).to.equal(
      'a/bem-core/b/button/__text/button__text@desktop.css',
    );
    expect(stringify(raisedButtonCore)).to.equal(
      'a/bem-core/b/button/_raised/button_raised.css',
    );
    expect(stringify(raisedButtonDesktopCore)).to.equal(
      'a/bem-core/b/button/_raised/button_raised@desktop.css',
    );
  });
});
