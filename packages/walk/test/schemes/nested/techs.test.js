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
