'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;

test('should not throw error if detected loop on itself', () => {
    var decl = [{ block: 'A' }],
        deps = [{
            entity: { block: 'A' },
            dependOn: [{ entity: { block: 'A' } }]
        }];

    expect(function () { resolve(decl, deps); }).to.not.throw();
});

test('should not throw error if detected direct loop', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    { entity: { block: 'B' } }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    { entity: { block: 'A' } }
                ]
            }
        ];

    expect(function () { resolve(decl, deps); }).to.not.throw();
});

test('should not throw error if detected indirect loop', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' },
            { block: 'C' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' }
                    }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'C' }
                    }
                ]
            },
            {
                entity: { block: 'C' },
                dependOn: [
                    {
                        entity: { block: 'A' }
                    }
                ]
            }
        ];

    expect(function () { resolve(decl, deps); }).to.not.throw();
});

test('should not throw error if detected intermediate loop', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' },
            { block: 'C' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' }
                    }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'C' }
                    }
                ]
            },
            {
                entity: { block: 'C' },
                dependOn: [
                    {
                        entity: { block: 'B' }
                    }
                ]
            }
        ];

    expect(function () { resolve(decl, deps); }).to.not.throw();
});
