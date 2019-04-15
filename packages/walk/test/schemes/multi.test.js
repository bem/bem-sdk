'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const afterEach = require('mocha').afterEach;

const expect = require('chai').expect;
const path = require('path');

const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../lib/index');

describe('schemes/multi', () => {
    afterEach('restore fs', () => {
        mockFs.restore();
    });

    it('should support several schemes', () => {
        mockFs({
            'flat.blocks': {
                'block.tech': ''
            },
            'nested.blocks': {
                'block': {
                    'block.tech': ''
                }
            }
        });

        const options = {
            levels: {
                'flat.blocks': { scheme: 'flat' },
                'nested.blocks': { scheme: 'nested' }
            }
        };

        return toArray(walk(['flat.blocks', 'nested.blocks'], options))
            .then(files => {
                const file1 = files[0];
                const file2 = files[1];

                expect(file1.cell.entity.valueOf()).to.deep.equal({ block: 'block' });
                expect(file1.level).to.match(/[/\\]flat.blocks$/);
                expect(file1.cell.tech).to.equal('tech');
                expect(file1.path).to.equal(path.join(file1.level, 'block.tech'));

                expect(file2.cell.entity.valueOf()).to.deep.equal({ block: 'block' });
                expect(file2.level).to.match(/[/\\]nested.blocks$/);
                expect(file2.cell.tech).to.equal('tech');
                expect(file2.path).to.equal(path.join(file2.level, 'block', 'block.tech'));
            });
    });
});
