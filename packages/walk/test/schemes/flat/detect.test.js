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

describe('schemes/flat/detect', () => {
    afterEach('restore fs', () => {
        mockFs.restore();
    });

    it('should detect block', () => {
        mockFs({
            blocks: {
                'block.tech': ''
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
                'block_mod.tech': ''
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
                'block_mod_val.tech': ''
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
                'block__elem.tech': ''
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
                'block__elem_mod.tech': ''
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
                'block__elem_mod_val.tech': ''
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
});
