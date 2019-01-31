'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const afterEach = require('mocha').afterEach;

const expect = require('chai').expect;

const mock = require('mock-fs');

const gather = require('..').gather;

describe('gather', () => {
    afterEach(() => {
        mock.restore();
    });

    it('should gather nothing when no blocks given', () => {
        mock({
            'common.blocks/': {}
        });

        const config = {
            levels: () => ['common.blocks'],
            levelMap: () => ({'common.blocks': {}})
        };

        return gather({ config }).then(data =>
            expect(data).to.deep.equal([])
        );
    });

    it.skip('should gather from one level given', () => {
        mock({
            'common.blocks/button/button.deps.js': ''
        });

        const config = {
            levels: () => ['common.blocks'],
            levelMap: () => ({'common.blocks': {}})
        };

        return gather({ config }).then(data => {
            expect(data.map(f => f.cell.id)).to.deep.equal([
                'button@common.deps.js'
            ]);
        });
    });

    it.skip('should gather entities', () => {
        mock({
            'common.blocks/button/button.deps.js': '',
            'common.blocks/input/input.deps.js': '',
            'desktop.blocks/header/header.deps.js': ''
        });

        const config = {
            levels: () => ['common.blocks', 'desktop.blocks'],
            levelMap: () => ({'common.blocks': {}})
        };

        return gather({ config }).then(data =>
            expect(data.map(f => f.cell.id)).to.deep.equal([
                'button@common.deps.js',
                'input@common.deps.js',
                'header@desktop.deps.js'
            ])
        );
    });
});
