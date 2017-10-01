'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const afterEach = require('mocha').afterEach;

const expect = require('chai').expect;
const path = require('path');

const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../../lib/index');

describe('schemes/nested/levels', () => {
    afterEach('restore fs', () => {
        try {
            mockFs.restore();
        } catch (e) {
            // ...
        }
    });

    it('should support level name with extension', () => {
        mockFs({
            'name.blocks': {
                block: {
                    'block.tech': ''
                }
            }
        });

        const options = {
            levels: {
                'name.blocks': { scheme: 'nested' }
            }
        };

        return toArray(walk(['name.blocks'], options))
            .then(files => {
                const file = files[0];

                expect(file.cell.entity.valueOf()).to.deep.equal({ block: 'block' });
                expect(file.level).to.equal('name.blocks');
                expect(file.cell.tech).to.equal('tech');
                expect(file.path).to.equal(path.join('name.blocks', 'block', 'block.tech'));
            });
    });

    it('should support few levels', () => {
        mockFs({
            'level-1': {
                'block-1': {
                    'block-1.tech': ''
                }
            },
            'level-2': {
                'block-2': {
                    'block-2.tech': ''
                }
            }
        });

        const options = {
            levels: {
                'level-1': { scheme: 'nested' },
                'level-2': { scheme: 'nested' }
            }
        };

        return toArray(walk(['level-1', 'level-2'], options))
            .then(files => {
                const file1 = files[0];
                const file2 = files[1];

                expect(file1.cell.entity.valueOf()).to.deep.equal({ block: 'block-1' });
                expect(file1.level).to.equal('level-1');
                expect(file1.cell.tech).to.equal('tech');
                expect(file1.path).to.equal(path.join('level-1', 'block-1', 'block-1.tech'));

                expect(file2.cell.entity.valueOf()).to.deep.equal({ block: 'block-2' });
                expect(file2.level).to.equal('level-2');
                expect(file2.cell.tech).to.equal('tech');
                expect(file2.path).to.equal(path.join('level-2', 'block-2', 'block-2.tech'));
            });
    });

    it('should detect entity with the same name on every level', () => {
        mockFs({
            'level-1': {
                block: {
                    'block.tech': ''
                }
            },
            'level-2': {
                block: {
                    'block.tech': ''
                }
            }
        });

        const options = {
            levels: {
                'level-1': { scheme: 'nested' },
                'level-2': { scheme: 'nested' }
            }
        };

        return toArray(walk(['level-1', 'level-2'], options))
            .then(files => {
                const file1 = files[0];
                const file2 = files[1];

                expect(file1.cell.entity.valueOf()).to.deep.equal({ block: 'block' });
                expect(file1.level).to.equal('level-1');
                expect(file1.cell.tech).to.equal('tech');
                expect(file1.path).to.equal(path.join('level-1', 'block', 'block.tech'));

                expect(file2.cell.entity.valueOf()).to.deep.equal({ block: 'block' });
                expect(file2.level).to.equal('level-2');
                expect(file2.cell.tech).to.equal('tech');
                expect(file2.path).to.equal(path.join('level-2', 'block', 'block.tech'));
            });
    });
});
