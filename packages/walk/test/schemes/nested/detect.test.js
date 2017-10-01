'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const afterEach = require('mocha').afterEach;

const expect = require('chai').expect;

const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../../lib/index');

const options = {
    levels: {
        blocks: { scheme: 'nested' }
    }
};

describe('schemes/nested/detect', () => {
    afterEach('restore fs', () => {
        mockFs.restore();
    });

    it('should detect block', () => {
        mockFs({
            blocks: {
                block: {
                    'block.tech': ''
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([{ block: 'block' }]);
            });
    });

    it('should detect bool mod of block', () => {
        mockFs({
            blocks: {
                block: {
                    _mod: {
                        'block_mod.tech': ''
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([{
                    block: 'block',
                    mod: { name: 'mod', val: true }
                }]);
            });
    });

    it('should detect key-val mod of block', () => {
        mockFs({
            blocks: {
                block: {
                    _mod: {
                        'block_mod_val.tech': ''
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([{
                    block: 'block',
                    mod: { name: 'mod', val: 'val' }
                }]);
            });
    });

    it('should detect elem', () => {
        mockFs({
            blocks: {
                block: {
                    __elem: {
                        'block__elem.tech': ''
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([{ block: 'block', elem: 'elem' }]);
            });
    });

    it('should detect bool mod of elem', () => {
        mockFs({
            blocks: {
                block: {
                    __elem: {
                        '_mod': {
                            'block__elem_mod.tech': ''
                        }
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([{
                    block: 'block',
                    elem: 'elem',
                    mod: { name: 'mod', val: true }
                }]);
            });
    });

    it('should detect key-val mod of elem', () => {
        mockFs({
            blocks: {
                block: {
                    __elem: {
                        _mod: {
                            'block__elem_mod_val.tech': ''
                        }
                    }
                }
            }
        });

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

    it('should detect complex entities', () => {
        mockFs({
            blocks: {
                block: {
                    'block.tech': '',
                    '_bool-mod': {
                        'block_bool-mod.tech': ''
                    },
                    _mod: {
                        'block_mod_val.tech': ''
                    },
                    __elem: {
                        'block__elem.tech': '',
                        '_bool-mod': {
                            'block__elem_bool-mod.tech': ''
                        },
                        _mod: {
                            'block__elem_mod_val.tech': ''
                        }
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                const entities = files.map(file => file.cell.entity.valueOf());

                expect(entities).to.deep.equal([
                    { block: 'block' },
                    { block: 'block', elem: 'elem' },
                    { block: 'block', mod: { name: 'bool-mod', val: true } },
                    { block: 'block', mod: { name: 'mod', val: 'val' } },
                    { block: 'block', elem: 'elem', mod: { name: 'bool-mod', val: true } },
                    { block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } }
                ]);
            });
    });
});
