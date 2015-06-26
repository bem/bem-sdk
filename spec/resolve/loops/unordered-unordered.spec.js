var expect  = require('chai').expect,
    resolve = require('../../../lib/index').resolve;

describe('resolving loops: unordered-unordered', function () {
    it('should not throw error if detected loop on itself', function () {
        var decl = [{ block: 'A' }],
            deps = [{
                entity: { block: 'A' },
                dependOn: [{ entity: { block: 'A' } }]
            }];

        expect(function () { resolve(decl, deps); }).to.not.throw();
    });

    it('should not throw error if detected direct loop', function () {
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

    it('should not throw error if detected indirect loop', function () {
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
                            entity: { block: 'С' }
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

    it('should not throw error if detected intermediate loop', function () {
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
});
