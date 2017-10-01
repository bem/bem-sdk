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

describe('schemes/nested/ignore', () => {
    afterEach('restore fs', () => {
        mockFs.restore();
    });

    it('should end if levels are not specified', () => {
        mockFs({});

        return toArray(walk([], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore empty level', () => {
        mockFs({
            blocks: {}
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore files without extension', () => {
        mockFs({
            blocks: {
                block: {
                    block: ''
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore files with no BEM basename in block dir', () => {
        mockFs({
            blocks: {
                block: {
                    '^_^.tech': ''
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore files with no BEM basename in mod dir', () => {
        mockFs({
            blocks: {
                block: {
                    _mod: {
                        '^_^.tech': ''
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore files with no BEM basename in elem dir', () => {
        mockFs({
            blocks: {
                block: {
                    __elem: {
                        '^_^.tech': ''
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore files with no BEM basename in elem mod dir', () => {
        mockFs({
            blocks: {
                block: {
                    __elem: {
                        _mod: {
                            '^_^.tech': ''
                        }
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore dirs with no BEM basename in block dir', () => {
        mockFs({
            blocks: {
                block: {
                    '^_^': {}
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore dirs with no BEM basename in mod dir', () => {
        mockFs({
            blocks: {
                block: {
                    _mod: {
                        '^_^': {}
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore dirs with no BEM basename in elem dir', () => {
        mockFs({
            blocks: {
                block: {
                    __elem: {
                        '^_^': {}
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore dirs with no BEM basename in elem mod dir', () => {
        mockFs({
            blocks: {
                block: {
                    __elem: {
                        _mod: {
                            '^_^': {}
                        }
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore file in root of level', () => {
        mockFs({
            blocks: {
                'block.tech': ''
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore block if filename not match with dirname', () => {
        mockFs({
            blocks: {
                block: {
                    'other-block.tech': ''
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore block mod if filename not match with dirname', () => {
        mockFs({
            blocks: {
                block: {
                    _mod: {
                        'block_other-mod.tech': ''
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore elem if filename not match with dirname', () => {
        mockFs({
            blocks: {
                block: {
                    __elem: {
                        'block__other-elem.tech': ''
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });

    it('should ignore elem mod if filename not match with dirname', () => {
        mockFs({
            blocks: {
                block: {
                    __elem: {
                        _mod: {
                            'block__elem_other-mod.tech': ''
                        }
                    }
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => expect(files).to.deep.equal([]));
    });
});
