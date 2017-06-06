'use strict';

const test = require('ava');
const naming = require('../index');

test('should have elem delim field', t => {
    t.truthy(naming.delims.elem);
});

test('should have mod name delim field', t => {
    t.truthy(naming.delims.mod.name);
});

test('should have mod val delim field', t => {
    t.truthy(naming.delims.mod.val);
});

test('should create namespace with elemDelim field', t => {
    const myNaming = naming();

    t.truthy(myNaming.delims.elem);
});

test('should create namespace with mod name delim field', t => {
    const myNaming = naming();

    t.truthy(myNaming.delims.mod.name);
});

test('should create namespace with mod val delim field', t => {
    const myNaming = naming();

    t.truthy(myNaming.delims.mod.val);
});
