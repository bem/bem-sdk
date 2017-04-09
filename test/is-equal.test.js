import test from 'ava';

import BemEntityName from '../index';

test('should detect equal block', t => {
    const entity1 = new BemEntityName({ block: 'block' });
    const entity2 = new BemEntityName({ block: 'block' });

    t.true(entity1.isEqual(entity2));
});

test('should not detect another block', t => {
    const entity1 = new BemEntityName({ block: 'block1' });
    const entity2 = new BemEntityName({ block: 'block2' });

    t.false(entity1.isEqual(entity2));
});
