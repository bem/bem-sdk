'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemjsonNode = require('../..');

describe('normalize', () => {

    it('should normalize mods field', () => {
        const node = new BemjsonNode({ block: 'block' });

        expect(node.mods).to.be.an('object');
    });

    it('should normalize elemMods field', () => {
        const node = new BemjsonNode({ block: 'block', elem: 'q' });

        expect(node.elemMods).to.be.an('object');
    });

    it('should normalize mix field into the array', () => {
        const mixedNode = new BemjsonNode({ block: 'mixed' });
        const node = new BemjsonNode({ block: 'block', mix: mixedNode });

        expect(node.mix).to.be.an('array');
        expect(node.mix[0]).to.equal(mixedNode);
    });

    it('should normalize string value in the mix field', () => {
        const node = new BemjsonNode({ block: 'block', mix: 'mixed' });

        expect(BemjsonNode.isBemjsonNode(node.mix[0])).to.equal(true);
        expect(node.mix[0].block).to.equal('mixed');
    });

    it('should normalize object value in the mix field', () => {
        const node = new BemjsonNode({ block: 'b1', mix: { block: 'b1', elem: 'e1' } });

        expect(BemjsonNode.isBemjsonNode(node.mix[0])).to.equal(true);
        expect(node.mix[0].elem).to.equal('e1');
    });
});
