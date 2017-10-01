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

describe('schemes/nested/techs', () => {
    afterEach('restore fs', () => {
        mockFs.restore();
    });

    it('should detect each techs of the same entity', () => {
        mockFs({
            blocks: {
                block: {
                    'block.tech-1': '',
                    'block.tech-2': ''
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                const techs = files.map(file => file.cell.tech);

                expect(techs).to.deep.equal(['tech-1', 'tech-2']);
            });
    });

    it('should support complex tech', () => {
        mockFs({
            blocks: {
                block: {
                    'block.tech-1.tech-2': ''
                }
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                const techs = files.map(file => file.cell.tech);

                expect(techs).to.deep.equal(['tech-1.tech-2']);
            });
    });
});
