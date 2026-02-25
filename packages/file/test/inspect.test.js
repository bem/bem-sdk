import util from 'node:util';
import { describe, it } from 'node:test';

import { expect } from 'chai';

import BemFile from '../file.js';

describe('inspect', () => {
    it('should return entity object', () => {
        const file = new BemFile({
            cell: { entity: { block: 'block' }, tech: 'css' },
            level: 'asd/qwe'
        });

        expect(util.inspect(file))
            .to.match(/BemFile { cell: { entity: { block: 'block' }, tech: 'css' },\s+level: 'asd\/qwe' }/);
    });
});
