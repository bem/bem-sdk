import { describe, it, afterEach } from 'mocha';
import { expect } from 'chai';

import mockFs from 'mock-fs';

import walk from '../../../lib/index.js';

async function toArray(stream) {
    const result = [];
    for await (const chunk of stream) result.push(chunk);
    return result;
}

const options = {
    levels: {
        blocks: { scheme: 'flat' }
    }
};

describe('schemes/flat/ignore', () => {
    afterEach('restore fs', () => {
        mockFs.restore();
    });

    it('should end if levels are not specified', () => {
        mockFs({});

        return toArray(walk([], options))
            .then(files => {
                expect(files).to.deep.equal([]);
            });
    });

    it('should ignore empty level', () => {
        mockFs({
            blocks: {}
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                expect(files).to.deep.equal([]);
            });
    });

    it('should ignore files without extension', () => {
        mockFs({
            blocks: {
                block: ''
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                expect(files).to.deep.equal([]);
            });
    });

    it('should ignore files with no BEM basename', () => {
        mockFs({
            blocks: {
                '^_^.ext': ''
            }
        });

        return toArray(walk(['blocks'], options))
            .then(files => {
                expect(files).to.deep.equal([]);
            });
    });
});
