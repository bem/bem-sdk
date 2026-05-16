import { expect } from 'chai';

import { bemjsonToJsx } from './index.js';

const transformer = bemjsonToJsx();
const transform = (json: Parameters<typeof transformer.process>[0]) =>
  transformer.process(json);

describe('transform', () => {
  it('returns string', () => {
    expect(transform({ block: 'button2' }).JSX).to.be.a('string');
  });

  it('accepts object', () => {
    expect(() => transform({ tag: 'span' }).JSX).not.to.throw();
  });

  it('accepts array', () => {
    expect(() => transform([{ tag: 'span' }]).JSX).not.to.throw();
  });

  it('transforms a block', () => {
    expect(transform({ block: 'button2' }).JSX).to.equal('<Button2/>');
  });

  describe('props', () => {
    it('string prop', () => {
      expect(transform({ block: 'button2', text: 'hello' }).JSX).to.equal(
        "<Button2 text='hello'/>",
      );
    });

    it('bool prop', () => {
      expect(transform({ block: 'button2', text: true }).JSX).to.equal(
        '<Button2 text={true}/>',
      );
    });

    it('number prop', () => {
      expect(transform({ block: 'button2', text: 42 }).JSX).to.equal(
        '<Button2 text={42}/>',
      );
    });

    it('array prop', () => {
      expect(
        transform({
          block: 'select2',
          val: 1,
          items: [{ val: 1 }, { val: 2 }],
        }).JSX,
      ).to.equal("<Select2 val={1} items={[{ 'val': 1 }, { 'val': 2 }]}/>");
    });

    it('object prop', () => {
      expect(
        transform({ block: 'button2', text: 'hello', val: { 42: 42 } }).JSX,
      ).to.equal("<Button2 text='hello' val={{ '42': 42 }}/>");
    });

    it('nested object prop', () => {
      expect(
        transform({ block: 'button2', text: 'hello', val: { 42: { 42: 42 } } })
          .JSX,
      ).to.equal("<Button2 text='hello' val={{ '42': { '42': 42 } }}/>");
    });
  });

  it('transforms several blocks', () => {
    expect(
      transform([
        { block: 'button2', text: 'hello' },
        { block: 'button2', text: 'world' },
      ]).JSX,
    ).to.equal("<Button2 text='hello'/>\n<Button2 text='world'/>");
  });

  it('handles content with several blocks', () => {
    expect(
      transform([
        {
          tag: 'span',
          content: [
            { block: 'button2', text: 'hello' },
            { block: 'button2', text: 'world' },
          ],
        },
      ]).JSX,
    ).to.equal(
      "<span>\n<Button2 text='hello'/>\n<Button2 text='world'/>\n</span>",
    );
  });

  it('flattens nested arrays in content', () => {
    expect(
      transform([
        [
          {
            tag: 'span',
            content: [
              [[{ block: 'button2', text: 'hello' }]],
              { block: 'button2', text: 'world' },
            ],
          },
        ],
        [],
      ]).JSX,
    ).to.equal(
      "<span>\n<Button2 text='hello'/>\n<Button2 text='world'/>\n</span>",
    );
  });

  it('transforms elem in context of block', () => {
    expect(
      transform({
        block: 'button2',
        content: { elem: 'text', content: 'Hello' },
      }).JSX,
    ).to.equal('<Button2>\n<Button2Text>\nHello\n</Button2Text>\n</Button2>');
  });

  it('treats mods as props', () => {
    expect(
      transform({ block: 'button2', mods: { theme: 'normal', size: 's' } })
        .JSX,
    ).to.equal("<Button2 theme='normal' size='s'/>");
  });

  it('keeps mix as obj', () => {
    expect(
      transform({ block: 'button2', mix: { block: 'header', elem: 'button' } })
        .JSX,
    ).to.equal("<Button2 mix={{ 'block': 'header', 'elem': 'button' }}/>");
  });

  it('renders entity-shaped custom prop as JSX', () => {
    expect(
      transform({
        block: 'button2',
        custom: { block: 'header', elem: 'button' },
      }).JSX,
    ).to.equal('<Button2 custom={<HeaderButton/>}/>');
  });

  it('treats strings as text', () => {
    expect(
      transform([
        'Hello I am a string',
        { block: 'button2', content: 'Hello I am a string' },
      ]).JSX,
    ).to.equal(
      'Hello I am a string\n<Button2>\nHello I am a string\n</Button2>',
    );
  });
});
