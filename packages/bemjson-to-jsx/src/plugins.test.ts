import { expect } from 'chai';

import { BemEntityName } from '@bem/sdk.entity-name';

import { bemjsonToJsx } from './index.js';

describe('plugins: copyMods', () => {
  it('without elem', () => {
    expect(
      bemjsonToJsx().process({
        block: 'button2',
        mods: { size: 'm', theme: 'normal' },
        elemMods: { size: 'l', theme: 'dark' },
      }).JSX,
    ).to.equal("<Button2 size='m' theme='normal'/>");
  });

  it('with elem', () => {
    expect(
      bemjsonToJsx().process({
        block: 'button2',
        elem: 'text',
        mods: { size: 'm', theme: 'normal' },
        elemMods: { size: 'l', theme: 'dark' },
      }).JSX,
    ).to.equal("<Button2Text size='l' theme='dark'/>");
  });
});

describe('plugins: whiteList', () => {
  it('no opts is a no-op', () => {
    const T = bemjsonToJsx();
    T.use(bemjsonToJsx.plugins.whiteList());
    expect(T.process({ block: 'button2' }).JSX).to.equal('<Button2/>');
  });

  it('filters non-whitelisted entities', () => {
    const T = bemjsonToJsx();
    T.use(
      bemjsonToJsx.plugins.whiteList({
        entities: [{ block: 'button2' }].map((e) => BemEntityName.create(e)),
      }),
    );

    expect(
      T.process({
        block: 'button2',
        content: [{ block: 'menu' }, { block: 'selec' }],
      }).JSX,
    ).to.equal('<Button2/>');
  });
});

describe('plugins: camelCaseProps', () => {
  it('mod-name -> modName', () => {
    expect(
      bemjsonToJsx().process({
        block: 'button2',
        mods: { 'has-clear': 'yes' },
      }).JSX,
    ).to.equal("<Button2 hasClear='yes'/>");
  });

  it('several keys', () => {
    expect(
      bemjsonToJsx().process({
        block: 'button2',
        mods: { 'has-clear': 'yes', 'has-tick': 'too' },
      }).JSX,
    ).to.equal("<Button2 hasClear='yes' hasTick='too'/>");
  });

  it('distinguishes mod-name and modname', () => {
    expect(
      bemjsonToJsx().process({
        block: 'button2',
        mods: { 'has-clear': 'yes', hasclear: 'yes' },
      }).JSX,
    ).to.equal("<Button2 hasClear='yes' hasclear='yes'/>");
  });
});

describe('plugins: stylePropToObj', () => {
  it('top-level style', () => {
    expect(
      bemjsonToJsx().process({ block: 'button2', style: 'width:200px' }).JSX,
    ).to.equal("<Button2 style={{ 'width': '200px' }}/>");
  });

  it('attrs.style', () => {
    expect(
      bemjsonToJsx().process({
        block: 'button2',
        attrs: { style: 'width:200px' },
      }).JSX,
    ).to.equal(
      "<Button2 style={{ 'width': '200px' }} attrs={{ 'style': { 'width': '200px' } }}/>",
    );
  });
});

describe('plugins: keepWhiteSpaces', () => {
  it('keeps leading space', () => {
    expect(
      bemjsonToJsx().process({ block: 'button2', content: ' space before' })
        .JSX,
    ).to.equal("<Button2>\n{' space before'}\n</Button2>");
  });

  it('keeps trailing space', () => {
    expect(
      bemjsonToJsx().process({ block: 'button2', content: 'space after ' })
        .JSX,
    ).to.equal("<Button2>\n{'space after '}\n</Button2>");
  });

  it('keeps wrapping spaces', () => {
    expect(
      bemjsonToJsx().process({
        block: 'button2',
        content: ' space before & after ',
      }).JSX,
    ).to.equal("<Button2>\n{' space before & after '}\n</Button2>");
  });

  it('keeps spaces in only-space text', () => {
    expect(
      bemjsonToJsx().process({
        block: 'button2',
        content: [' ', '  ', '   '],
      }).JSX,
    ).to.equal("<Button2>\n{' '}\n{'  '}\n{'   '}\n</Button2>");
  });
});
