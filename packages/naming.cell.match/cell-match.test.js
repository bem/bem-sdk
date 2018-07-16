'use strict';

const safeEval = require('node-eval');

const BemCell = require('@bem/sdk.cell');
const { legacy, origin, react } = require('@bem/sdk.naming.presets');
const createMatch = require('.');

const flatLegacyMatch = createMatch(Object.assign({}, legacy, { fs: Object.assign({}, legacy.fs, { scheme: 'flat' }) }));
const flatOriginMatch = createMatch(Object.assign({}, origin, { fs: Object.assign({}, origin.fs, { scheme: 'flat' }) }));
const mixedOriginMatch = createMatch(Object.assign({}, origin, { fs: Object.assign({}, origin.fs, { scheme: 'mixed' }) }));
const originMatch = createMatch(origin);
const mixedModernMatch = createMatch(Object.assign({}, origin, { fs: Object.assign({}, origin.fs, { scheme: 'mixed',
    pattern: '${entity}${layer?@${layer}}.${tech}' }) }));
const nestedModernMatch = createMatch(Object.assign({}, origin, { fs: Object.assign({}, origin.fs, { scheme: 'nested',
    pattern: '${entity}${layer?@${layer}}.${tech}' }) }));
const nestedModernEmptyElemMatch = createMatch(Object.assign({}, react, { fs: Object.assign({}, react.fs, { scheme: 'nested',
    pattern: '${entity}${layer?@${layer}}.${tech}' }) }));
const flexOriginMatch = createMatch(Object.assign({}, origin, { fs: Object.assign({}, origin.fs, { scheme: 'flex' }) }));

const { expect } = require('chai');

describe('naming.cell.match', () => {
    for (const [dTitle, [match, its]] of Object.entries({
        'flat / legacy': [flatLegacyMatch, rawses`
            reject invalid                 → blocks           → { isMatch: false }
            reject invalid block: _bb      → _bb              → { isMatch: false }
            reject invalid block: .bb      → .bb              → { isMatch: false }
            reject nested scheme           → bb/_mod          → { isMatch: false }
            reject mixed scheme            → bb/bb.css        → { isMatch: false }
            reject block without tech      → bb               → { isMatch: false }
            parse fully qualified tech     → bb.css           → { cell: { layer: 'common', block: 'bb', tech: 'css' } }
            parse fully … complex tech     → bb.t1.t2         → { cell: { layer: 'common', block: 'bb', tech: 't1.t2' } }

            parse full path to block       → bb.t             → { cell: { layer: 'common', block: 'bb', tech: 't' } }
            parse full path to block mod   → bb_m.t           → { cell: { layer: 'common', block: 'bb', mod: 'm', tech: 't' } }
            parse full path to block mod2  → bb_m_v.t         → { cell: { layer: 'common', block: 'bb', mod: 'm', val: 'v', tech: 't' } }
            parse full path to elem        → bb__e.t          → { cell: { layer: 'common', block: 'bb', elem: 'e', tech: 't' } }
            parse full path to elem mod    → bb__e_m.t        → { cell: { layer: 'common', block: 'bb', elem: 'e', mod: 'm', tech: 't' } }
            parse full path to elem mod2   → bb__e_m_v.t      → { cell: { layer: 'common', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' } }

            find & reject file elem        → bb__e.t/x.y      → { cell: { layer: 'common', block: 'bb', elem: 'e', tech: 't' }, isMatch: false, rest: '/x.y' }
            find & reject file block mod2  → bb_m_v.t/x.y     → { cell: { layer: 'common', block: 'bb', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
            find & reject file elem mod2   → bb__e_m_v.t/x.y  → { cell: { layer: 'common', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
        `],

        'flat / origin': [flatOriginMatch, rawses`
            reject invalid block: _bb      → common.blocks/_bb          → { isMatch: false }
            reject invalid block: .bb      → common.blocks/.bb          → { isMatch: false }
            reject nested scheme           → common.blocks/bb/_mod      → { isMatch: false }
            reject mixed scheme            → common.blocks/bb/bb.css    → { isMatch: false }
            reject block without tech      → common.blocks/bb           → { isMatch: false }
            match partial layer            → blocks                     → { isMatch: true }
            match partial layer            → common.blocks              → { isMatch: true }
            parse fully qualified tech     → common.blocks/bb.css       → { cell: { layer: 'common', block: 'bb', tech: 'css' } }

            parse full path to block       → dd.blocks/bb.t             → { cell: { layer: 'dd', block: 'bb', tech: 't' } }
            parse full path to block mod   → dd.blocks/bb_m.t           → { cell: { layer: 'dd', block: 'bb', mod: 'm', tech: 't' } }
            parse full path to block mod2  → dd.blocks/bb_m_v.t         → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' } }
            parse full path to elem        → dd.blocks/bb__e.t          → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' } }
            parse full path to elem mod    → dd.blocks/bb__e_m.t        → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', tech: 't' } }
            parse full path to elem mod2   → dd.blocks/bb__e_m_v.t      → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' } }

            find & reject file elem        → dd.blocks/bb__e.t/x.y      → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' }, isMatch: false, rest: '/x.y' }
            find & reject file block mod2  → dd.blocks/bb_m_v.t/x.y     → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
            find & reject file elem mod2   → dd.blocks/bb__e_m_v.t/x.y  → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
        `],

        'mixed / origin': [mixedOriginMatch, rawses`
            reject invalid block: _block   → common.blocks/_button         → { isMatch: false }
            reject invalid block: .button  → common.blocks/.button         → { isMatch: false }
            reject nested scheme           → common.blocks/button/_mod     → { isMatch: false }
            reject block without tech      → common.blocks/button/button   → { isMatch: false }
            match valid block: button      → common.blocks/button          → { isMatch: true }
            match partial layer            → blocks                        → { isMatch: true }
            match partial layer            → common.blocks                 → { isMatch: true }
            parse fully qualified tech     → common.blocks/bb/bb.css       → { cell: { layer: 'common', block: 'bb', tech: 'css' } }

            parse full path to block       → dd.blocks/bb/bb.t             → { cell: { layer: 'dd', block: 'bb', tech: 't' } }
            parse full path to block mod   → dd.blocks/bb/bb_m.t           → { cell: { layer: 'dd', block: 'bb', mod: 'm', tech: 't' } }
            parse full path to block mod2  → dd.blocks/bb/bb_m_v.t         → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' } }
            parse full path to elem        → dd.blocks/bb/bb__e.t          → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' } }
            parse full path to elem mod    → dd.blocks/bb/bb__e_m.t        → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', tech: 't' } }
            parse full path to elem mod2   → dd.blocks/bb/bb__e_m_v.t      → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' } }

            rejects alien block            → dd.blocks/qq/bb.t             → { isMatch: false }
            rejects alien block mod        → dd.blocks/qq/bb_m.t           → { isMatch: false }
            rejects alien block mod2       → dd.blocks/qq/bb_m_v.t         → { isMatch: false }
            rejects alien elem             → dd.blocks/qq/bb__e.t          → { isMatch: false }
            rejects alien elem mod         → dd.blocks/qq/bb__e_m.t        → { isMatch: false }
            rejects alien elem mod2        → dd.blocks/qq/bb__e_m_v.t      → { isMatch: false }

            find & reject file elem        → dd.blocks/bb/bb__e.t/x.y      → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' }, isMatch: false, rest: '/x.y' }
            find & reject file block mod2  → dd.blocks/bb/bb_m_v.t/x.y     → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
            find & reject file elem mod2   → dd.blocks/bb/bb__e_m_v.t/x.y  → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
        `],

        'nested / origin': [originMatch, rawses`
            reject invalid block: _button  → common.blocks/_button           → { isMatch: false }
            reject invalid block: .button  → common.blocks/.button           → { isMatch: false }
            reject blocks inside block     → common.blocks/button/button     → { isMatch: false }
            match partial layer            → blocks                          → { isMatch: true }
            match partial layer            → common.blocks                   → { isMatch: true }
            match valid block              → common.blocks/button            → { isMatch: true }
            match valid mod inside button  → common.blocks/button/_mod       → { isMatch: true }
            parse full valid path to block → common.blocks/button/button.css → { cell: { layer: 'common', block: 'button', tech: 'css' } }
            parse full valid path to mod2  → common.blocks/b/_m/b_m_v.t      → { cell: { layer: 'common', block: 'b', mod: 'm', val: 'v', tech: 't' } }

            parse full path to block       → dd.blocks/bb/bb.t               → { cell: { layer: 'dd', block: 'bb', tech: 't' } }
            parse full path to block mod   → dd.blocks/bb/_m/bb_m.t          → { cell: { layer: 'dd', block: 'bb', mod: 'm', tech: 't' } }
            parse full path to block mod2  → dd.blocks/bb/_m/bb_m_v.t        → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' } }
            parse full path to elem        → dd.blocks/bb/__e/bb__e.t        → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' } }
            parse full path to elem mod    → dd.blocks/bb/__e/_m/bb__e_m.t   → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', tech: 't' } }
            parse full path to elem mod2   → dd.blocks/bb/__e/_m/bb__e_m_v.t → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' } }

            rejects alien block            → dd.blocks/qq/bb.t               → { isMatch: false }
            rejects alien block mod        → dd.blocks/qq/_m/bb_m.t          → { isMatch: false }
            rejects alien block mod2       → dd.blocks/qq/_m/bb_m_v.t        → { isMatch: false }
            rejects alien block elem       → dd.blocks/qq/__e/bb__e.t        → { isMatch: false }
            rejects alien block elem mod   → dd.blocks/qq/__e/_m/bb__e_m.t   → { isMatch: false }
            rejects alien block elem mod2  → dd.blocks/qq/__e/_m/bb__e_m_v.t → { isMatch: false }
            rejects alien elem             → dd.blocks/bb/__f/bb__e.t        → { isMatch: false }
            rejects alien elem mod         → dd.blocks/bb/__f/_m/bb__e_m.t   → { isMatch: false }
            rejects alien elem mod2        → dd.blocks/bb/__f/_m/bb__e_m_v.t → { isMatch: false }
            rejects alien mod              → dd.blocks/bb/_n/bb_m.t          → { isMatch: false }
            rejects alien mod2             → dd.blocks/bb/_n/bb_m_v.t        → { isMatch: false }
            rejects alien mod in elem      → dd.blocks/bb/__e/_n/bb__e_m.t   → { isMatch: false }
            rejects alien mod2 in elem     → dd.blocks/bb/__e/_n/bb__e_m_v.t → { isMatch: false }

            find & reject file elem        → dd.blocks/bb/__e/bb__e.t/x.y        → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' }, isMatch: false, rest: '/x.y' }
            find & reject file block mod2  → dd.blocks/bb/_m/bb_m_v.t/x.y        → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
            find & reject file elem mod2   → dd.blocks/bb/__e/_m/bb__e_m_v.t/x.y → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
        `],

        'mixed / modern': [mixedModernMatch, rawses`
            reject invalid block           → .blocks                → { cell: null, isMatch: false }
            reject typical path for layer  → common.blocks          → { cell: null, isMatch: false }
            reject nested block path       → blocks/button          → { cell: null, isMatch: false }
            reject invalid block: _button  → button/_button         → { cell: null, isMatch: false }
            reject nested scheme mod       → button/_mod            → { cell: null, isMatch: false }
            reject invalid block           → button/button          → { cell: null, isMatch: false }
            match partial block path       → blocks                 → { cell: null, isMatch: true }
            parse typical block path       → blocks/blocks.css      → { cell: { layer: 'common', block: 'blocks', tech: 'css' } }
            parse typical block in layer   → blocks/blocks@ios.css  → { cell: { layer: 'ios', block: 'blocks', tech: 'css' } }
            parse typical mod path         → button/button_mod.css  → { cell: { layer: 'common', block: 'button', mod: 'mod', tech: 'css' } }
        `],

        'nested / modern': [nestedModernMatch, rawses`
            reject invalid block           → .blocks                → { cell: null, isMatch: false }
            reject typical path for layer  → common.blocks          → { cell: null, isMatch: false }
            reject nested block path       → blocks/button          → { cell: null, isMatch: false }
            reject invalid block           → button/button          → { cell: null, isMatch: false }
            match partial block path       → blocks                 → { cell: null, isMatch: true }
            match partial mod path: _btn   → btn/_btn               → { cell: null, isMatch: true }
            parse typical block path       → blocks/blocks.css      → { cell: { layer: 'common', block: 'blocks', tech: 'css' } }
            parse typical block in layer   → blocks/blocks@ios.css  → { cell: { layer: 'ios', block: 'blocks', tech: 'css' } }
            parse typical mod path         → button/_mod/button_mod.css  → { cell: { layer: 'common', block: 'button', mod: 'mod', tech: 'css' } }
        `],

        'nested / modern + react': [nestedModernEmptyElemMatch, rawses`
            reject invalid block           → .blocks                → { cell: null, isMatch: false }
            reject typical path for layer  → common.blocks          → { cell: null, isMatch: false }
            match partial block path       → bb                     → { cell: null, isMatch: true }
            match partial mod path: _mm    → bb/_mm                 → { cell: null, isMatch: true }
            parse typical block path       → bb/bb.css              → { cell: { layer: 'common', block: 'bb', tech: 'css' } }
            parse typical elem path        → bb/ee/bb-ee.css        → { cell: { layer: 'common', block: 'bb', elem: 'ee', tech: 'css' } }
            parse typical block in layer   → bb/bb@ios.css          → { cell: { layer: 'ios', block: 'bb', tech: 'css' } }
            parse typical mod path         → bb/_mod/bb_mod.css     → { cell: { layer: 'common', block: 'bb', mod: 'mod', tech: 'css' } }
        `],

        'flex / origin': [flexOriginMatch, rawses`
            reject invalid block: _bb      → common.blocks/_bb                → { isMatch: false }
            reject invalid block: .bb      → common.blocks/.bb                → { isMatch: false }
            reject block without tech      → common.blocks/bb/bb              → { isMatch: false }

            match partial layer            → blocks                           → { isMatch: true }
            match partial common.layer     → common.blocks                    → { isMatch: true }
            match valid block: bb          → common.blocks/bb                 → { isMatch: true }
            parse fully qualified tech     → common.blocks/bb/bb.css          → { cell: { layer: 'common', block: 'bb', tech: 'css' } }

            parse full path to block       → dd.blocks/bb/bb.t                → { cell: { layer: 'dd', block: 'bb', tech: 't' } }
            parse full path to block mod   → dd.blocks/bb/bb_m.t              → { cell: { layer: 'dd', block: 'bb', mod: 'm', tech: 't' } }
            parse full path to block mod2  → dd.blocks/bb/bb_m_v.t            → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' } }
            parse full path to block mod   → dd.blocks/bb/_m/bb_m.t           → { cell: { layer: 'dd', block: 'bb', mod: 'm', tech: 't' } }
            parse full path to block mod2  → dd.blocks/bb/_m/bb_m_v.t         → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' } }
            parse full path to elem        → dd.blocks/bb/bb__e.t             → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' } }
            parse full path to elem mod    → dd.blocks/bb/bb__e_m.t           → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', tech: 't' } }
            parse full path to elem mod2   → dd.blocks/bb/bb__e_m_v.t         → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' } }
            parse full path to elem        → dd.blocks/bb/__e/bb__e.t         → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' } }
            parse full path to elem mod    → dd.blocks/bb/__e/bb__e_m.t       → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', tech: 't' } }
            parse full path to elem mod2   → dd.blocks/bb/__e/bb__e_m_v.t     → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' } }
            parse full path to elem mod    → dd.blocks/bb/__e/_m/bb__e_m.t    → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', tech: 't' } }
            parse full path to elem mod2   → dd.blocks/bb/__e/_m/bb__e_m_v.t  → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' } }

            find & reject file elem        → dd.blocks/bb/bb__e.t/x.y         → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' }, isMatch: false, rest: '/x.y' }
            find & reject file block mod2  → dd.blocks/bb/bb_m_v.t/x.y        → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
            find & reject file elem mod2   → dd.blocks/bb/bb__e_m_v.t/x.y     → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }

            rejects alien block            → dd.blocks/qq/bb.t                → { isMatch: false }
            rejects alien block mod        → dd.blocks/qq/bb_m.t              → { isMatch: false }
            rejects alien block mod2       → dd.blocks/qq/bb_m_v.t            → { isMatch: false }
            rejects alien elem             → dd.blocks/qq/bb__e.t             → { isMatch: false }
            rejects alien elem mod         → dd.blocks/qq/bb__e_m.t           → { isMatch: false }
            rejects alien elem mod2        → dd.blocks/qq/bb__e_m_v.t         → { isMatch: false }
        `],

        // 'flex / modern': [nestedModernMatch, rawses`
        //     reject invalid block           → .blocks                → { cell: null, isMatch: false }
        //     reject typical path for layer  → common.blocks          → { cell: null, isMatch: false }
        //     reject nested block path       → blocks/button          → { cell: null, isMatch: false }
        //     reject invalid block           → button/button          → { cell: null, isMatch: false }
        //     match partial block path       → blocks                 → { cell: null, isMatch: true }
        //     match partial mod path: _btn   → btn/_btn               → { cell: null, isMatch: true }
        //     parse typical block path       → blocks/blocks.css      → { cell: { layer: 'common', block: 'blocks', tech: 'css' } }
        //     parse typical block in layer   → blocks/blocks@ios.css  → { cell: { layer: 'ios', block: 'blocks', tech: 'css' } }
        //     parse typical mod path         → button/_mod/button_mod.css  → { cell: { layer: 'common', block: 'button', mod: 'mod', tech: 'css' } }
        // `],

        // 'flex / modern + react': [nestedModernEmptyElemMatch, rawses`
        //     reject invalid block           → .blocks                → { cell: null, isMatch: false }
        //     reject typical path for layer  → common.blocks          → { cell: null, isMatch: false }
        //     match partial block path       → bb                     → { cell: null, isMatch: true }
        //     match partial mod path: _mm    → bb/_mm                 → { cell: null, isMatch: true }
        //     parse typical block path       → bb/bb.css              → { cell: { layer: 'common', block: 'bb', tech: 'css' } }
        //     parse typical elem path        → bb/ee/bb-ee.css        → { cell: { layer: 'common', block: 'bb', elem: 'ee', tech: 'css' } }
        //     parse typical block in layer   → bb/bb@ios.css          → { cell: { layer: 'ios', block: 'bb', tech: 'css' } }
        //     parse typical mod path         → bb/_mod/bb_mod.css     → { cell: { layer: 'common', block: 'bb', mod: 'mod', tech: 'css' } }
        // `],
    })) {
        describe(dTitle, () => {
            for (const [title, relPath, expected] of its) {
                it(title, () => {
                    expect(simplifyCell(match(relPath))).eql(expected);
                });
            }
        });
    }
});

/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 * @param {string[]} strings The strings in the template literal
 * @returns {string} The template literal, with spaces removed from all lines
 */
function rawses(strings) {
    const templateValue = strings[0].replace(/\n+/g, '\n');
    const lines = templateValue.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n');
    const lineIndents = lines.filter(line => line.trim()).map(line => line.match(/ */)[0].length);
    const minLineIndent = Math.min.apply(null, lineIndents);

    return lines
        .map(line => {
            const [ title, relPath, rawExpected ] = line.slice(minLineIndent).split('→').map(s => s.trim());

            const expected = {
                cell: null,
                isMatch: null,
                rest: null,
                ...safeEval(`(${rawExpected})`)
            };
            expected.cell = expected.cell ? BemCell.create(expected.cell).id : null;
            expected.isMatch = expected.isMatch === false ? false : Boolean(expected.isMatch || expected.cell);

            return [ title, relPath, expected ];
        });
}

function simplifyCell(res) {
    res.cell && (res.cell = res.cell.id);
    return res;
}
