'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;

test('should not throw error if detected loop on itself', () => {
    var decl = [{ block: 'A' }],
        deps = [{
            entity: { block: 'A' },
            dependOn: [{
                entity: { block: 'A' },
                order: 'dependenceBeforeDependants'
            }]
        }];

    expect(function () { resolve(decl, deps); }).to.not.throw();
});

test('should throw error if detected direct loop', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'A' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        error = null;

    try {
        resolve(decl, deps);
    } catch (e) {
        error = e;
    }

    expect(error.loop).to.be.deep.equal([
        { entity: { block: 'A' } },
        { entity: { block: 'B' } },
        { entity: { block: 'A' } }
    ]);
});

test('should throw error if detected indirect loop', () => {
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
                        entity: { block: 'B' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'C' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'C' },
                dependOn: [
                    {
                        entity: { block: 'A' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        error = null;

    try {
        resolve(decl, deps);
    } catch (e) {
        error = e;
    }
    expect(error.loop).to.be.deep.equal([
        { entity: { block: 'A' } },
        { entity: { block: 'B' } },
        { entity: { block: 'C' } },
        { entity: { block: 'A' } }
    ]);
});

test('should throw error if detected intermediate loop', () => {
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
                        entity: { block: 'B' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'C' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'C' },
                dependOn: [
                    {
                        entity: { block: 'B' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        error = null;

    try {
        resolve(decl, deps);
    } catch (e) {
        error = e;
    }
    expect(error.loop).to.be.deep.equal([
        { entity: { block: 'B' } },
        { entity: { block: 'C' } },
        { entity: { block: 'B' } }
    ]);
});

test.skip('should throw error if detected direct entity - tech loop', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'A' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        error = null;

    try {
        resolve(decl, deps, opts);
    } catch (e) {
        error = e;
    }

    expect(error.loop).to.be.deep.equal([
        { entity: { block: 'A' } },
        { entity: { block: 'B' }, tech: 'css' },
        { entity: { block: 'A' } }
    ]);
});

test.skip('should throw error if detected direct tech - entity loop', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'A' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        error = null;

    try {
        resolve(decl, deps, opts);
    } catch (e) {
        error = e;
    }

    expect(error.loop).to.be.deep.equal([
        { entity: { block: 'A' } },
        { entity: { block: 'B' } },
        { entity: { block: 'A' }, tech: 'css' }
    ]);
});

test('should not throw error if detected loop on itself and one of techs is matching with resolving ' +
    'tech', () => {
    var decl = [{ block: 'A' }],
        deps = [{
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [{
                entity: { block: 'A' },
                tech: 'js',
                order: 'dependenceBeforeDependants'
            }]
        }],
        opts = { tech: 'css' };

    expect(function () { resolve(decl, deps, opts); }).to.not.throw();
});

test.skip('should throw error if detected direct loop and both techs are matching with resolving tech', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'B' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'B' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'A' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        error = null;

    try {
        resolve(decl, deps, opts);
    } catch (e) {
        error = e;
    }

    expect(error.loop).to.be.deep.equal([
        { entity: { block: 'A' }, tech: 'css' },
        { entity: { block: 'B' }, tech: 'css' },
        { entity: { block: 'A' }, tech: 'css' }
    ]);
});

test('should not throw error if detected direct loop and one of techs is not matching with resolving ' +
    'tech', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'B' },
                        tech: 'js',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'B' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'A' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' };

    expect(function () { resolve(decl, deps, opts); }).to.not.throw();
});

test('should not throw error if detected indirect loop and one of techs is not matching with resolving ' +
    'tech', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' },
            { block: 'C' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'B' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'B' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'C' },
                        tech: 'js',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'C' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'A' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' };

    expect(function () { resolve(decl, deps, opts); }).to.not.throw();
});

test('should not throw error if detected intermediate loop and one of techs is matching with resolving ' +
    'tech', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'B' },
                        tech: 'css'
                    }
                ]
            },
            {
                entity: { block: 'B' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'C' },
                        tech: 'js',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'C' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'B' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ];

    expect(function () { resolve(decl, deps); }).to.not.throw();
});
