import test from 'ava';

import BemEntityName from '../lib/entity-name';

test('should be true for simple modifiers', t => {
    const entityName = new BemEntityName({ block: 'block', mod: 'mod' });

    t.true(entityName.isSimpleMod());
});

test('should be false for complex modifiers', t => {
    const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

    t.false(entityName.isSimpleMod());
});

test('should be null for block', t => {
    const entityName = BemEntityName.create({ block: 'button2' });

    t.is(entityName.isSimpleMod(), null);
});

test('should be null for element', t => {
    const entityName = BemEntityName.create({ block: 'button2', elem: 'text' });

    t.is(entityName.isSimpleMod(), null);
});
