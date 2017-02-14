const test = require('ava');

const BemEntityName = require('../index');

test('should be true for simple modifiers', t => {
    const entity = BemEntityName.create({ block: 'button2', mod: { name: 'theme' } });
    t.true(entity.isSimpleMod());
});

test('should be true for tricky modifiers', t => {
    const entity = BemEntityName.create({ block: 'button2', mod: { name: 'theme', val: true } });
    t.true(entity.isSimpleMod());
});

test('should be false for complex modifiers', t => {
    const entity = BemEntityName.create({ block: 'button2', mod: { name: 'theme', val: 'normal' } });
    t.false(entity.isSimpleMod());
});

test('should be false for sneaky modifiers', t => {
    const entity = BemEntityName.create({ block: 'button2', mod: { name: 'theme', val: false } });
    t.false(entity.isSimpleMod());
});

test('should be false for crafty modifiers', t => {
    const entity = BemEntityName.create({ block: 'button2', mod: { name: 'theme', val: 42 } });
    t.false(entity.isSimpleMod());
});

test('should be false for block', t => {
    const entity = BemEntityName.create({ block: 'button2' });
    t.false(entity.isSimpleMod());
});

test('should be false for elem', t => {
    const entity = BemEntityName.create({ block: 'button2', elem: 'text' });
    t.false(entity.isSimpleMod());
});
