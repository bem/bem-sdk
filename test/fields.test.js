'use strict';

const test = require('ava');
const naming = require('../index');

test('should have elemDelim field', t => {
    t.truthy(naming.elemDelim);
});

test('should have modDelim field', t => {
    t.truthy(naming.modDelim);
});

test('should have modValDelim field', t => {
    t.truthy(naming.modValDelim);
});

test('should create namespace with elemDelim field', t => {
    const myNaming = naming();

    t.truthy(myNaming.elemDelim);
});

test('should create namespace with modDelim field', t => {
    const myNaming = naming();

    t.truthy(myNaming.modDelim);
});

test('should create namespace with modValDelim field', t => {
    const myNaming = naming();

    t.truthy(myNaming.modValDelim);
});
