'use strict';

const test = require('ava');

const v = utils.createVertex;

test('should create block vertex', t => {
    t.is(v('a').id, v({block: 'a'}).id);
});

test('should create block with true mod', t => {
    t.is(v('a_m').id, 'a_m');
    t.is(v({block: 'a', modName: 'm', modVal: true}).id, 'a_m');
});

test('should create block with usual mod', t => {
    t.is(v('a_m_v').id, 'a_m_v');
    t.is(v({block: 'a', modName: 'm', modVal: 'v'}).id, 'a_m_v');
});

test('should create elem vertex', t => {
    t.is(v('a__e').id, 'a__e');
    t.is(v({block: 'a', elem: 'e'}).id, 'a__e');
});

test('should create elem with true mod', t => {
    t.is(v('a__e_m').id, 'a__e_m');
    t.is(v({block: 'a', elem: 'e', modName: 'm', modVal: true}).id, 'a__e_m');
});

test('should create elem with usual mod', t => {
    t.is(v('a__e_m_v').id, 'a__e_m_v');
    t.is(v({block: 'a', elem: 'e', modName: 'm', modVal: 'v'}).id, 'a__e_m_v');
});

test('should create block with tech vertex', t => {
    t.is(v('a.css').id, 'a.css');
    t.is(v({block: 'a'}, 'css').id, 'a.css');
});

test('should create elem with tech vertex', t => {
    t.is(v('a__e.css').id, 'a__e.css');
    t.is(v({block: 'a', elem: 'e'}, 'css').id, 'a__e.css');
});
