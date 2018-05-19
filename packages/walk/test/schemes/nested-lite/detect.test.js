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
        blocks: { scheme: 'nested-lite' }
    }
};

describe('schemes/nested-lite/detect', () => {
    afterEach('restore fs', () => {
        mockFs.restore();
    });

    it('should detect block', () => {
        mockFs({
            blocks: {
                block: {
                    'tech': ''
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
                        tech: ''
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
                        _val: {
                            tech: ''
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
                    mod: { name: 'mod', val: 'val' }
                }]);
            });
    });

    it('should detect elem', () => {
        mockFs({
            blocks: {
                block: {
                    __elem: {
                        tech: ''
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
                        _mod: {
                            tech: ''
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
                            _val: {
                                tech: ''
                            }
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
                    tech: '',
                    '_bool-mod': {
                        tech: ''
                    },
                    _mod: {
                        _val: {
                            tech: ''
                        }
                    },
                    __elem: {
                        tech: '',
                        '_bool-mod': {
                            'tech': ''
                        },
                        _mod: {
                            _val: {
                                'tech': ''
                            }
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
                    { block: 'block', elem: 'elem', mod: { name: 'bool-mod', val: true } },
                    { block: 'block', mod: { name: 'mod', val: 'val' } },
                    { block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } }
                ]);
            });
    });
});
