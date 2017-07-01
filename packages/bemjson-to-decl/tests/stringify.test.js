'use strict';

const expect = require('chai').expect;
const stringify = require('..').stringify;

it('should stringify simple bemjson', () => {
    expect(stringify({ block: 'button2' })).to.equal(
`[
    {
        block: 'button2'
    }
]`);

});

it('should stringify bemjson with several entities', () => {
    expect(stringify({
        block: 'button2',
        content: [
            { block: 'icon', mods: { type: 'left' }},
            { block: 'icon', mods: { type: 'right' }}
        ]})).to.equal(
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
]`);

});

it('should stringify bemjson with ctx', () => {
    expect(stringify({ elem: 'text' }, { block: 'button2' })).to.equal(
`[
    {
        block: 'button2',
        elem: 'text'
    }
]`);

});

it('should stringify bemjson with stringify opts', () => {
    expect(stringify({ block: 'button2', elem: 'text' }, null, { indent: '  ' })).to.equal(
`[
  {
    block: 'button2',
    elem: 'text'
  }
]`);

});
