const test = require('ava');

const BemEntityName = require('../index');

test('should not detect belonging between block and itself', t => {
    const blockName = new BemEntityName({ block: 'block' });

    t.false(blockName.belongsTo(blockName));
});

test('should not detect belonging between elem and itself', t => {
    const elemName = new BemEntityName({ block: 'block', elem: 'elem' });

    t.false(elemName.belongsTo(elemName));
});

test('should not detect belonging between block mod and itself', t => {
    const modName = new BemEntityName({ block: 'block', mod: 'mod' });

    t.false(modName.belongsTo(modName));
});

test('should not detect belonging between elem mod and itself', t => {
    const modName = new BemEntityName({ block: 'block', elem: 'elem', mod: 'mod' });

    t.false(modName.belongsTo(modName));
});

test('should resolve belonging between block and its elem', t => {
    const blockName = new BemEntityName({ block: 'block' });
    const elemName = new BemEntityName({ block: 'block', elem: 'elem' });

    t.true(elemName.belongsTo(blockName));
    t.false(blockName.belongsTo(elemName));
});

test('should not detect belonging between two block', t => {
    const name1 = new BemEntityName({ block: 'block1' });
    const name2 = new BemEntityName({ block: 'block2' });

    t.false(name1.belongsTo(name2));
    t.false(name2.belongsTo(name1));
});

test('should not detect belonging between two mods of block', t => {
    const modName1 = new BemEntityName({ block: 'block', mod: 'mod1' });
    const modName2 = new BemEntityName({ block: 'block', mod: 'mod2' });

    t.false(modName1.belongsTo(modName2));
    t.false(modName2.belongsTo(modName1));
});

test('should not detect belonging between two elems of block', t => {
    const elemName1 = new BemEntityName({ block: 'block', elem: 'elem1' });
    const elemName2 = new BemEntityName({ block: 'block', elem: 'elem2' });

    t.false(elemName1.belongsTo(elemName2));
    t.false(elemName2.belongsTo(elemName1));
});

test('should resolve belonging between block and its mod', t => {
    const blockName = new BemEntityName({ block: 'block' });
    const modName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key' } });

    t.true(modName.belongsTo(blockName));
    t.false(blockName.belongsTo(modName));
});

test('should resolve belonging between elem and its mod', t => {
    const elemName = new BemEntityName({ block: 'block', elem: 'elem' });
    const modName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key' } });

    t.true(modName.belongsTo(elemName));
    t.false(elemName.belongsTo(modName));
});

test('should not detect belonging between block and its elem mod', t => {
    const blockName = new BemEntityName({ block: 'block' });
    const elemModName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key' } });

    t.false(elemModName.belongsTo(blockName));
    t.false(blockName.belongsTo(elemModName));
});

test('should not detect belonging between block and its elem with the same mod', t => {
    const blockModName = new BemEntityName({ block: 'block', mod: 'mod' });
    const elemModName = new BemEntityName({ block: 'block', elem: 'elem', mod: 'mod' });

    t.false(elemModName.belongsTo(blockModName));
    t.false(blockModName.belongsTo(elemModName));
});

test('should resolve belonging between boolean and key-value mod of block', t => {
    const boolModName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: true } });
    const modName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key' } });

    t.true(modName.belongsTo(boolModName));
    t.false(boolModName.belongsTo(modName));
});

test('should resolve belonging between boolean and key-value mod of element', t => {
    const boolModName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: true } });
    const modName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key' } });

    t.true(modName.belongsTo(boolModName));
    t.false(boolModName.belongsTo(modName));
});

test('should not detect belonging between key-value mods of block', t => {
    const modName1 = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key1' } });
    const modName2 = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key2' } });

    t.false(modName1.belongsTo(modName2));
    t.false(modName2.belongsTo(modName1));
});

test('should not detect belonging between key-value mods of elem', t => {
    const modName1 = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key1' } });
    const modName2 = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key2' } });

    t.false(modName1.belongsTo(modName2));
    t.false(modName2.belongsTo(modName1));
});
