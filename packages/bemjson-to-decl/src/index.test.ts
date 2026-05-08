import { expect } from 'chai';
import { BemEntityName } from '@bem/sdk.entity-name';
import type { EntityNameCreateOptions } from '@bem/sdk.entity-name';

import { convert, stringify } from './index.js';

function bemEql(actual: BemEntityName[], expected: EntityNameCreateOptions[]): void {
  expect(actual).to.have.lengthOf(expected.length);
  const expectedEntities = expected.map((e) => BemEntityName.create(e));
  expect(actual.every((a, i) => expectedEntities[i]!.isEqual(a))).to.equal(
    true,
    `actual: ${actual.map((a) => JSON.stringify(a.valueOf())).join(', ')}\nexpected: ${expectedEntities.map((a) => JSON.stringify(a.valueOf())).join(', ')}`,
  );
}

describe('bemjson-to-decl / convert', () => {
  it('returns an array', () => {
    expect(convert({ block: 'button2' })).to.be.an('Array');
  });

  it('returns empty array on empty input', () => {
    expect(convert({})).to.have.lengthOf(0);
    expect(convert([])).to.have.lengthOf(0);
    expect(convert([null])).to.have.lengthOf(0);
  });

  describe('block', () => {
    it('extracts block', () => {
      bemEql(convert({ block: 'button2' }), [{ block: 'button2' }]);
    });

    it('extracts block with simple modifier', () => {
      bemEql(convert({ block: 'popup', mods: { autoclosable: true } }), [
        { block: 'popup' },
        { block: 'popup', mod: { name: 'autoclosable' } },
      ]);
    });

    it('extracts block with modifier', () => {
      bemEql(convert({ block: 'popup', mods: { autoclosable: 'yes' } }), [
        { block: 'popup' },
        { block: 'popup', mod: { name: 'autoclosable' } },
        { block: 'popup', mod: { name: 'autoclosable', val: 'yes' } },
      ]);
    });

    it('extracts block with several modifiers', () => {
      bemEql(
        convert({
          block: 'popup',
          mods: { theme: 'normal', autoclosable: true },
        }),
        [
          { block: 'popup' },
          { block: 'popup', mod: { name: 'theme' } },
          { block: 'popup', mod: { name: 'theme', val: 'normal' } },
          { block: 'popup', mod: { name: 'autoclosable' } },
        ],
      );
    });

    it('does not extract block modifier from elemMod', () => {
      const result = convert({
        block: 'popup',
        elemMods: { autoclosable: true },
      });
      const ids = result.map((e) => e.id);
      expect(ids).to.not.include('popup_autoclosable');
    });
  });

  describe('elem', () => {
    it('extracts elem', () => {
      bemEql(convert({ block: 'button2', elem: 'text' }), [
        { block: 'button2', elem: 'text' },
      ]);
    });

    it('extracts elem with simple modifier', () => {
      bemEql(
        convert({
          block: 'button2',
          elem: 'text',
          elemMods: { pseudo: true },
        }),
        [
          { block: 'button2', elem: 'text' },
          { block: 'button2', elem: 'text', mod: { name: 'pseudo' } },
        ],
      );
    });

    it('extracts elem with modifier', () => {
      bemEql(
        convert({
          block: 'button2',
          elem: 'text',
          elemMods: { pseudo: 'yes' },
        }),
        [
          { block: 'button2', elem: 'text' },
          { block: 'button2', elem: 'text', mod: { name: 'pseudo' } },
          {
            block: 'button2',
            elem: 'text',
            mod: { name: 'pseudo', val: 'yes' },
          },
        ],
      );
    });

    it('extracts elem with several modifiers', () => {
      bemEql(
        convert({
          block: 'popup',
          elem: 'tail',
          elemMods: { theme: 'normal', autoclosable: true },
        }),
        [
          { block: 'popup', elem: 'tail' },
          { block: 'popup', elem: 'tail', mod: { name: 'theme' } },
          {
            block: 'popup',
            elem: 'tail',
            mod: { name: 'theme', val: 'normal' },
          },
          { block: 'popup', elem: 'tail', mod: { name: 'autoclosable' } },
        ],
      );
    });
  });

  describe('content', () => {
    it('content can be obj', () => {
      bemEql(convert({ content: { block: 'button2' } }), [{ block: 'button2' }]);
    });

    it('content can be arr', () => {
      bemEql(convert({ content: [{ block: 'button2' }] }), [
        { block: 'button2' },
      ]);
    });

    it('extracts separate blocks', () => {
      bemEql(
        convert({ block: 'user2', content: { block: 'button2' } }),
        [{ block: 'user2' }, { block: 'button2' }],
      );
    });

    it('extracts same block only once', () => {
      bemEql(
        convert({
          block: 'user2',
          content: { block: 'user2', content: { block: 'user2' } },
        }),
        [{ block: 'user2' }],
      );
    });

    it('extracts elems', () => {
      bemEql(
        convert({
          block: 'button2',
          content: { block: 'button2', elem: 'text' },
        }),
        [{ block: 'button2' }, { block: 'button2', elem: 'text' }],
      );
    });

    it('extracts elems using block context', () => {
      bemEql(
        convert({ block: 'button2', content: { elem: 'text' } }),
        [{ block: 'button2' }, { block: 'button2', elem: 'text' }],
      );
    });

    it('extracts elems using elem context', () => {
      bemEql(
        convert({
          block: 'button2',
          elem: 'text',
          content: { elem: 'icon' },
        }),
        [
          { block: 'button2', elem: 'text' },
          { block: 'button2', elem: 'icon' },
        ],
      );
    });
  });

  describe('mix', () => {
    it('mix can be obj', () => {
      bemEql(convert({ mix: { block: 'button2' } }), [{ block: 'button2' }]);
    });

    it('mix can be arr', () => {
      bemEql(convert({ mix: [{ block: 'button2' }] }), [{ block: 'button2' }]);
    });

    it('extracts separate blocks', () => {
      bemEql(convert({ block: 'user2', mix: { block: 'button2' } }), [
        { block: 'user2' },
        { block: 'button2' },
      ]);
    });

    it('extracts elems using block context', () => {
      bemEql(convert({ block: 'button2', mix: { elem: 'text' } }), [
        { block: 'button2' },
        { block: 'button2', elem: 'text' },
      ]);
    });
  });

  describe('js / attrs', () => {
    it('js keys can be obj', () => {
      bemEql(convert({ js: { id: { block: 'button2' } } }), [
        { block: 'button2' },
      ]);
    });

    it('attrs keys can be obj', () => {
      bemEql(convert({ attrs: { id: { block: 'button2' } } }), [
        { block: 'button2' },
      ]);
    });

    it('extracts elems using block context for js', () => {
      bemEql(
        convert({ block: 'button2', js: { id: { elem: 'text' } } }),
        [{ block: 'button2' }, { block: 'button2', elem: 'text' }],
      );
    });

    it('extracts elems using elem context for attrs', () => {
      bemEql(
        convert({
          block: 'button2',
          elem: 'text',
          attrs: { id: { elem: 'icon' } },
        }),
        [
          { block: 'button2', elem: 'text' },
          { block: 'button2', elem: 'icon' },
        ],
      );
    });
  });

  describe('aggressive', () => {
    it('resolves custom props object', () => {
      bemEql(convert({ block: 'button2', icon: { block: 'icon' } }), [
        { block: 'button2' },
        { block: 'icon' },
      ]);
    });

    it('resolves custom props array', () => {
      bemEql(
        convert({
          block: 'button2',
          icon: [{ block: 'icon' }, { block: 'input', elem: 'control' }],
        }),
        [
          { block: 'button2' },
          { block: 'icon' },
          { block: 'input', elem: 'control' },
        ],
      );
    });
  });
});

describe('bemjson-to-decl / stringify', () => {
  it('stringifies simple bemjson', () => {
    expect(stringify({ block: 'button2' })).to.equal(
      `[
    {
        block: 'button2'
    }
]`,
    );
  });

  it('stringifies bemjson with several entities', () => {
    expect(
      stringify({
        block: 'button2',
        content: [
          { block: 'icon', mods: { type: 'left' } },
          { block: 'icon', mods: { type: 'right' } },
        ],
      }),
    ).to.equal(
      `[
    {
        block: 'button2'
    },
    {
        block: 'icon'
    },
    {
        block: 'icon',
        mod: {
            name: 'type',
            val: true
        }
    },
    {
        block: 'icon',
        mod: {
            name: 'type',
            val: 'left'
        }
    },
    {
        block: 'icon',
        mod: {
            name: 'type',
            val: 'right'
        }
    }
]`,
    );
  });

  it('stringifies bemjson with ctx', () => {
    expect(stringify({ elem: 'text' }, { block: 'button2' })).to.equal(
      `[
    {
        block: 'button2',
        elem: 'text'
    }
]`,
    );
  });

  it('honors stringify opts.indent', () => {
    expect(
      stringify({ block: 'button2', elem: 'text' }, undefined, { indent: '  ' }),
    ).to.equal(
      `[
  {
    block: 'button2',
    elem: 'text'
  }
]`,
    );
  });
});
