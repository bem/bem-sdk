'use strict';

const expect = require('chai').expect;

var T = require('../lib');

var BemEntity = require('@bem/sdk.entity-name');

describe('pluginis', () => {

    describe('copyMods', () => {
        it('without elem', () => {
            var res = T().process({
                    block: 'button2',
                    mods: {size: 'm', theme: 'normal'},
                    elemMods: {size: 'l', theme: 'dark'}
                });

            expect(res.JSX).to.equal(
                `<Button2 size='m' theme='normal'/>`
            );
        });

        it('with elem', () => {
            var res = T()
                .process({
                    block: 'button2',
                    elem: 'text',
                    mods: {size: 'm', theme: 'normal'},
                    elemMods: {size: 'l', theme: 'dark'}
                });

            expect(res.JSX).to.equal(
                `<Button2Text size='l' theme='dark'/>`
            );
        });
    });

    describe('whiteList', () => {
        it('without opts', () => {
            var res = T()
                .use(T.plugins.whiteList())
                .process({ block: 'button2' });

            expect(res.JSX).to.equal(
                '<Button2/>'
            );
        });

        it('whiteList', () => {
            var res = T()
                .use(T.plugins.whiteList({ entities: [{ block: 'button2' }].map(BemEntity.create) }))
                .process({ block: 'button2', content: [{ block: 'menu' }, { block: 'selec' }] });

            expect(res.JSX).to.equal(
                '<Button2/>'
            );
        });
    });

    describe('camelCaseProps', () => {
        it('should transform mod-name to modName', () => {
            var res = T().process({ block: 'button2', mods: { 'has-clear': 'yes' } });

            expect(res.JSX).to.equal(
                `<Button2 hasClear='yes'/>`
            );
        });

        it('should transform several mod-names to modName', () => {
            var res = T().process({ block: 'button2', mods: { 'has-clear': 'yes', 'has-tick': 'too' } });

            expect(res.JSX).to.equal(
                `<Button2 hasClear='yes' hasTick='too'/>`
            );
        });

        it('should distinguish mod-name and modname', () => {
            var res = T().process({ block: 'button2', mods: { 'has-clear': 'yes', 'hasclear': 'yes' } });

            expect(res.JSX).to.equal(
                `<Button2 hasClear='yes' hasclear='yes'/>`
            );
        });
    });

    describe('stylePropToObj', () => {
        it('styleProp to obj', () => {
            var res = T().process({ block: 'button2', style: 'width:200px' });

            expect(res.JSX).to.equal(
                `<Button2 style={{ 'width': '200px' }}/>`
            );
        });

        it('attrs style to obj', () => {
            var res = T().process({ block: 'button2', attrs: { style: 'width:200px' } });

            expect(res.JSX).to.equal(
                `<Button2 style={{ 'width': '200px' }} attrs={{ 'style': { 'width': '200px' } }}/>`
            );
        });
    });

    describe('keepWhiteSpaces', () => {
        it('should keep spaces before simple text', ()  => {
            var res = T().process({ block: 'button2', content: ' space before' });

            expect(res.JSX).to.equal(
                `<Button2>\n{' space before'}\n</Button2>`
            );
        });

        it('should keep spaces after simple text', ()  => {
            var res = T().process({ block: 'button2', content: 'space after ' });

            expect(res.JSX).to.equal(
                `<Button2>\n{'space after '}\n</Button2>`
            );
        });

        it('should keep spaces before & after simple text', ()  => {
            var res = T().process({ block: 'button2', content: ' space before & after ' });

            expect(res.JSX).to.equal(
                `<Button2>\n{' space before & after '}\n</Button2>`
            );
        });

        it('should keep spaces in only spaces simple text', ()  => {
            var res = T().process({ block: 'button2', content: [' ', '  ', '   ']});

            expect(res.JSX).to.equal(
                `<Button2>\n{' '}\n{'  '}\n{'   '}\n</Button2>`
            );
        });
    });

});
