'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const v = require('../../lib/test-utils').createVertex;

describe('utils/create-vertex.test.js', () => {
    it('should create block vertex', () => {
        expect(v('a').id).to.equal(v({block: 'a'}).id);
    });

    it('should create block with true mod', () => {
        expect(v('a_m').id).to.equal('a_m');
        expect(v({block: 'a', modName: 'm', modVal: true}).id).to.equal('a_m');
    });

    it('should create block with usual mod', () => {
        expect(v('a_m_v').id).to.equal('a_m_v');
        expect(v({block: 'a', modName: 'm', modVal: 'v'}).id).to.equal('a_m_v');
    });

    it('should create elem vertex', () => {
        expect(v('a__e').id).to.equal('a__e');
        expect(v({block: 'a', elem: 'e'}).id).to.equal('a__e');
    });

    it('should create elem with true mod', () => {
        expect(v('a__e_m').id).to.equal('a__e_m');
        expect(v({block: 'a', elem: 'e', modName: 'm', modVal: true}).id).to.equal('a__e_m');
    });

    it('should create elem with usual mod', () => {
        expect(v('a__e_m_v').id).to.equal('a__e_m_v');
        expect(v({block: 'a', elem: 'e', modName: 'm', modVal: 'v'}).id).to.equal('a__e_m_v');
    });

    it('should create block with tech vertex', () => {
        expect(v('a.css').id).to.equal('a.css');
        expect(v({block: 'a'}, 'css').id).to.equal('a.css');
    });

    it('should create elem with tech vertex', () => {
        expect(v('a__e.css').id).to.equal('a__e.css');
        expect(v({block: 'a', elem: 'e'}, 'css').id).to.equal('a__e.css');
    });
});
