'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const naming = require('../index');

describe('fields.test.js', () => {
    it('should have elem delim field', () => {
        expect(naming.delims.elem).to.be.ok;
    });

    it('should have mod name delim field', () => {
        expect(naming.delims.mod.name).to.be.ok;
    });

    it('should have mod val delim field', () => {
        expect(naming.delims.mod.val).to.be.ok;
    });

    it('should create namespace with elemDelim field', () => {
        const myNaming = naming();

        expect(myNaming.delims.elem).to.be.ok;
    });

    it('should create namespace with mod name delim field', () => {
        const myNaming = naming();

        expect(myNaming.delims.mod.name).to.be.ok;
    });

    it('should create namespace with mod val delim field', () => {
        const myNaming = naming();

        expect(myNaming.delims.mod.val).to.be.ok;
    });
});
