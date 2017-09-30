'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const naming = require('../index');

describe('options.test.js', () => {
    it('should throw error if specified preset is unknow', () => {
        expect(
            function () {
                return naming('my-preset');
            }
        ).to.throw('The `my-preset` naming is unknown.');
    });

    it('should provide elem option', () => {
        const myNaming = naming({ delims: { elem: '==' } });

        expect(myNaming.delims.elem).to.equal('==');
    });

    it('should support mod option as string', () => {
        const myNaming = naming({ delims: { mod: '--' } });

        expect(myNaming.delims.mod.name).to.equal('--');
        expect(myNaming.delims.mod.val).to.equal('--');
    });

    it('should support mod option as object', () => {
        const myNaming = naming({ delims: { mod: { name: '--', val: '_' } } });

        expect(myNaming.delims.mod.name).to.equal('--');
        expect(myNaming.delims.mod.val).to.equal('_');
    });

    it('should use default value if mod.val is not specified', () => {
        const myNaming = naming({ delims: { mod: { name: '--' } } });

        expect(myNaming.delims.mod.name).to.equal('--');
        expect(myNaming.delims.mod.val).to.equal(naming.delims.mod.val);
    });
});
