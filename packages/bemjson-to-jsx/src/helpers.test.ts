import { expect } from 'chai';

import { objToStr, styleToObj } from './helpers.js';

describe('helpers: objToStr', () => {
  it('stringifies simple object', () => {
    expect(objToStr({ hello: 'world' })).to.equal("{ 'hello': 'world' }");
  });

  it('returns empty obj literal', () => {
    expect(objToStr({})).to.equal('{}');
  });

  it('handles many keys', () => {
    expect(objToStr({ 42: 42, hello: 'world' })).to.equal(
      "{ '42': 42, 'hello': 'world' }",
    );
  });

  it('handles property names with spaces', () => {
    expect(objToStr({ 'hello world': 42 })).to.equal("{ 'hello world': 42 }");
  });

  describe('value', () => {
    it('::string', () => {
      expect(objToStr({ hello: 'string' })).to.equal("{ 'hello': 'string' }");
    });
    it('::number', () => {
      expect(objToStr({ hello: 42 })).to.equal("{ 'hello': 42 }");
    });
    it('::bool', () => {
      expect(objToStr({ hello: true })).to.equal("{ 'hello': true }");
    });
    it('::null', () => {
      expect(objToStr({ hello: null })).to.equal("{ 'hello': null }");
    });
    it('::undefined', () => {
      expect(objToStr({ hello: undefined })).to.equal("{ 'hello': undefined }");
    });
    it('::object', () => {
      expect(objToStr({ hello: { 42: 42 } })).to.equal(
        "{ 'hello': { '42': 42 } }",
      );
    });
    it('::function', () => {
      // Function source rendering depends on the engine / TS down-compilation
      // (`()=>42` vs `() => 42`); we only assert the structural envelope here.
      const out = objToStr({ hello: () => 42 });
      expect(out.startsWith("{ 'hello': ")).to.equal(true);
      expect(out).to.match(/=>\s*42/);
      expect(out.endsWith(' }')).to.equal(true);
    });
    it('::array', () => {
      expect(objToStr({ hello: [1, 2, 3] })).to.equal(
        "{ 'hello': [1, 2, 3] }",
      );
    });
  });
});

describe('helpers: styleToObj', () => {
  it('parses style string', () => {
    expect(styleToObj('width:200px;height:100px;')).to.deep.equal({
      width: '200px',
      height: '100px',
    });
  });

  it('passes through style object unchanged', () => {
    expect(styleToObj({ width: '200px', height: '100px' })).to.deep.equal({
      width: '200px',
      height: '100px',
    });
  });

  it('trims whitespace around colons and semicolons (#241)', () => {
    expect(styleToObj('width: 200px; height: 100px;')).to.deep.equal({
      width: '200px',
      height: '100px',
    });
    expect(styleToObj('  margin: 0 ; padding : 4px ;  ')).to.deep.equal({
      margin: '0',
      padding: '4px',
    });
  });
});
