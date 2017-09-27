'use strict';

const expect = require('chai').expect;
const BemCell = require('@bem/sdk.cell');

const method = require('..');

const button = BemCell.create({ block: 'button', tech: 'css' });
const buttonCommon = BemCell.create({ block: 'button', layer: 'common', tech: 'css' });
const buttonDesktop = BemCell.create({ block: 'button', layer: 'desktop', tech: 'css' });
const buttonTextDesktop = BemCell.create({ block: 'button', elem: 'text', layer: 'desktop', tech: 'css' });
const raisedButton = BemCell.create({ block: 'button', mod: 'raised', tech: 'css' });
const raisedButtonDesktop = BemCell.create({ block: 'button', mod: 'raised', layer: 'desktop', tech: 'css' });

describe('cell.stringify', () => {
    it('should stringify cell w/o layer without pattern', () => {
        const stringify = method({
            fs: {delims: {elem: '$$$', mod: {}}, scheme: 'flat', pattern: '${entity}@${layer}.${tech}'}
        });

        expect(stringify(button))
            .to.equal('button@common.css');
    });

    it('should stringify cell w/o layer with simple pattern', () => {
        const stringify = method({fs: {
            scheme: 'flat',
            pattern: '${layer}.blocks/${entity}.${tech}'
        }});

        expect(stringify(button))
            .to.equal('common.blocks/button.css');
    });

    it('should stringify cell w/o layer with simple pattern and unknown variable in pattern', () => {
        const stringify = method({fs: {
            scheme: 'flat',
            pattern: '${layer}.blocks/${non-sence}${entity}.${tech}'
        }});

        expect(stringify(button))
            .to.equal('common.blocks/button.css');
    });

    it('should stringify desktop cell with simple pattern', () => {
        const stringify = method({fs: {
            scheme: 'flat',
            pattern: '${layer}.blocks/${entity}.${tech}'
        }});

        expect(stringify(buttonCommon))
            .to.equal('common.blocks/button.css');

        expect(stringify(buttonDesktop))
            .to.equal('desktop.blocks/button.css');
    });

    it('should stringify desktop cell with complex pattern', () => {
        const stringify = method({fs: {
            scheme: 'flat',
            pattern: '${entity}${layer?@${layer}}.${tech}'
        }});

        expect(stringify(buttonCommon))
            .to.equal('button@common.css');

        expect(stringify(buttonDesktop))
            .to.equal('button@desktop.css');
    });

    it('should stringify desktop cell with custom stringifier', () => {
        const stringify = method({fs: {
            scheme: 'flat',
            pattern: '${entity}${layer?@${layer}}.${tech}',
            defaultLayer: 'common'
        }});

        expect(stringify(buttonCommon))
            .to.equal('button.css');

        expect(stringify(buttonDesktop))
            .to.equal('button@desktop.css');

        expect(stringify(buttonTextDesktop))
            .to.equal('button__text@desktop.css');

        expect(stringify(raisedButton))
            .to.equal('button_raised.css');

        expect(stringify(raisedButtonDesktop))
            .to.equal('button_raised@desktop.css');
    });

    it('should stringify desktop cell with custom stringifier and nested scheme', () => {
        const stringify = method({fs: {
            scheme: 'nested',
            pattern: '${entity}${layer?@${layer}}.${tech}',
            defaultLayer: 'common'
        }});

        expect(stringify(buttonCommon))
            .to.equal('button/button.css');

        expect(stringify(buttonDesktop))
            .to.equal('button/button@desktop.css');

        expect(stringify(buttonTextDesktop))
            .to.equal('button/__text/button__text@desktop.css');

        expect(stringify(raisedButton))
            .to.equal('button/_raised/button_raised.css');

        expect(stringify(raisedButtonDesktop))
            .to.equal('button/_raised/button_raised@desktop.css');
    });
});
