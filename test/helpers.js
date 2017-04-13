const expect = require('chai').expect;

const objToStr = require('../lib/helpers').objToStr;


describe('helpers: objToStr', () => {
    it('should stringify object', () => {
        expect(objToStr({ hello: 'world' })).to.equal('{ \'hello\': \'world\' }');
    });

    it('should return empty string for empty obj', () => {
        expect(objToStr({})).to.equal('');
    });

    it('should process many keys', () => {
        expect(objToStr({ 42: 42, hello: 'world' })).to.equal('{ \'42\': 42, \'hello\': \'world\' }');
    });

    it('should process property names as strings', () => {
        expect(objToStr({ 'hello world': 42 })).to.equal('{ \'hello world\': 42 }');
    });

    xit('should process computed property names', () => {
        expect(objToStr({ ['hello' + 'world']: 42 })).to.equal('{ [\'hello\' + \'world\']: 42 }');
    });

    describe('value', () => {
        it('::string', () => {
            expect(objToStr({ hello: 'string' })).to.equal('{ \'hello\': \'string\' }');
        });

        it('::number', () => {
            expect(objToStr({ hello: 42 })).to.equal('{ \'hello\': 42 }');
        });

        it('::bool', () => {
            expect(objToStr({ hello: true })).to.equal('{ \'hello\': true }');
        });

        it('::null', () => {
            expect(objToStr({ hello: null })).to.equal('{ \'hello\': null }');
        });

        it('::undefined', () => {
            expect(objToStr({ hello: undefined })).to.equal('{ \'hello\': undefined }');
        });

        it('::object', () => {
            expect(objToStr({ hello: { 42: 42 } })).to.equal('{ \'hello\': { \'42\': 42 } }');
        });

        it('::function', () => {
            expect(objToStr({ hello: () => 42 })).to.equal('{ \'hello\': () => 42 }');
        });

        it('::array', () => {
            expect(objToStr({ hello: [1, 2, 3] })).to.equal('{ \'hello\': [1, 2, 3] }');
        });
    });
});
