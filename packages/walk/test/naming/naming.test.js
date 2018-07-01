'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const afterEach = require('mocha').afterEach;

const expect = require('chai').expect;

const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../..');

describe('naming/naming legacy version', () => {
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

describe('naming/naming sdk version', () => {
    afterEach('restore fs', () => {
        mockFs.restore();
    });

    it('should support original naming', () => {
        mockFs({
            'some/blocks': {
                'block__elem_mod_val.tech': ''
            }
        });

        const options = {
            levels: {
                some: {
                    naming: { fs: { scheme: 'flat' } }
                }
            }
        };

        return toArray(walk(['some'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([{
                    block: 'block',
                    elem: 'elem',
                    mod: { name: 'mod', val: 'val' }
                }]);
            });
    });

    it('should support mixed scheme', () => {
        mockFs({
            'some/blocks': {
                'block.tech': '',
                'block/__elem/block__elem.tech': '',
                'block/block__elem_mod_val.tech': '',
            }
        });

        const options = {
            levels: {
                'some': {
                    naming: {
                        fs: { scheme: 'mixed' },
                    }
                }
            }
        };

        return toArray(walk(['some'], options))
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
            'some/blocks': {
                'block__elem--mod_val.tech': ''
            }
        });

        const options = {
            levels: {
                'some': {
                    naming: {
                        preset: 'two-dashes',
                        fs: { scheme: 'flat' },
                    }
                }
            }
        };

        return toArray(walk(['some'], options))
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
            'some/blocks': {
                'bb-ee--mv.tt': '',
                // 'b1-e2--m3.tech': '',
            }
        });

        const options = {
            levels: {
                some: {
                    naming: {
                        delims: {
                            elem: '-',
                            mod: '--',
                        },
                        fs: { scheme: 'flat' },
                        wordPattern: '[bemvtt]+',
                    }
                }
            }
        };

        return toArray(walk(['some'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([{
                    block: 'bb',
                    elem: 'ee',
                    mod: { name: 'mv', val: true }
                }]);
            });
    });

    it('should support several naming', () => {
        mockFs({
            'orig/blocks': {
                'block_mod.tech': ''
            },
            'twod/blocks': {
                'block--mod_val.tech': ''
            }
        });

        const options = {
            levels: {
                'orig': { naming: { fs: { scheme: 'flat' } } },
                'twod': { naming: { preset: 'two-dashes', fs: { scheme: 'flat' } } },
            }
        };

        return toArray(walk(['orig', 'twod'], options))
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
