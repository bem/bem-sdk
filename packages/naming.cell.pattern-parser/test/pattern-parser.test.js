'use strict';

const expect = require('chai').expect;

const method = require('..');

describe('pattern-parser', () => {
    it('should throw on incorrect pattern', () => {
        expect(() => method('qwe} {layer} $ ${entity?'))
            .to.throw(/Unclosed paren/);
    });

    it('should parse simple pattern', () => {
        expect(method('${layer}.blocks/${entity}.${tech}'))
            .to.deep.equal(['', 'layer', '.blocks/', 'entity', '.', 'tech']);
    });

    it('should parse complex pattern', () => {
        expect(method('${entity}${layer?@${layer}}.${tech}'))
            .to.deep.equal(['', 'entity', '', ['layer', '@', 'layer'], '.', 'tech']);
    });

    it('should parse recursive pattern', () => {
        expect(method('${entity?${entity}${layer?@${layer}${tech?.${tech}-foo}_bar}.baz}'))
            .to.deep.equal(['',
                ['entity',
                    '', 'entity', '',
                    ['layer',
                        '@', 'layer', '',
                        ['tech',
                            '.', 'tech', '-foo'
                        ],
                        '_bar'
                    ],
                    '.baz'
                ]
            ]);
    });
});
