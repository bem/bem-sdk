'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const afterEach = require('mocha').afterEach;

const expect = require('chai').expect;

const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../lib/index');

describe('naming/naming', () => {
    afterEach('restore fs', () => {
        mockFs.restore();
    });

    it('should support original naming', () => {
        mockFs({
            blocks: {
                'block__elem_mod_val.tech': ''
            }
        });

        const options = {
            levels: {
                blocks: {
                    naming: 'origin',
                    scheme: 'flat'
                }
            }
        };

        return toArray(walk(['blocks'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([{
                    block: 'block',
                    elem: 'elem',
                    mod: { name: 'mod', val: 'val' }
                }]);
            });
    });

    it('should support two-dashes naming', () => {
        mockFs({
            blocks: {
                'block__elem--mod_val.tech': ''
            }
        });

        const options = {
            levels: {
                blocks: {
                    naming: 'two-dashes',
                    scheme: 'flat'
                }
            }
        };

        return toArray(walk(['blocks'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([{
                    block: 'block',
                    elem: 'elem',
                    mod: { name: 'mod', val: 'val' }
                }]);
            });
    });

    it('should support custom naming', () => {
        mockFs({
            blocks: {
                'block-elem--boolMod.tech': ''
            }
        });

        const options = {
            levels: {
                blocks: {
                    naming: {
                        delims: {
                            elem: '-',
                            mod: '--'
                        },
                        wordPattern: '[a-zA-Z0-9]+'
                    },
                    scheme: 'flat'
                }
            }
        };

        return toArray(walk(['blocks'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([{
                    block: 'block',
                    elem: 'elem',
                    mod: { name: 'boolMod', val: true }
                }]);
            });
    });

    it('should support several naming', () => {
        mockFs({
            'origin.blocks': {
                'block_mod.tech': ''
            },
            'two-dashes.blocks': {
                'block--mod_val.tech': ''
            }
        });

        const options = {
            levels: {
                'origin.blocks': {
                    naming: 'origin',
                    scheme: 'flat'
                },
                'two-dashes.blocks': {
                    naming: 'two-dashes',
                    scheme: 'flat'
                }
            }
        };

        return toArray(walk(['origin.blocks', 'two-dashes.blocks'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([
                    {
                        block: 'block',
                        mod: { name: 'mod', val: true }
                    },
                    {
                        block: 'block',
                        mod: { name: 'mod', val: 'val' }
                    }
                ]);
            });
    });
});
