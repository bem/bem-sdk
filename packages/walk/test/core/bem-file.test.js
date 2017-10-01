'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('@bem/sdk.entity-name');
const BemCell = require('@bem/sdk.cell');

const BemFile = require('../../lib/bem-file');

describe('core/bem-file', () => {
    it('should provide classic bem-file fields', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'b', elem: 'e' }),
            tech: 'css',
            layer: 'bem-components/desktop'
        });
        const path = 'bem-components/desktop.blocks/b/__e/b__e.css';
        const file = new BemFile(cell, path);

        expect(file.cell).to.equal(cell);
        expect(file.entity).to.equal(cell.entity);
        expect(file.tech).to.equal(cell.tech);
        expect(file.level).to.equal(cell.layer);
        expect(file.layer).to.equal(cell.layer);
        expect(file.path).to.equal(path);
    });
});
