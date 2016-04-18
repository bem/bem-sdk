import test from 'ava';

import BemEntity from '../index';

test('should detect equal block', t => {
    const entity1 = new BemEntity({ block: 'block' });
    const entity2 = new BemEntity({ block: 'block' });

    t.true(entity1.isEqual(entity2));
});

test('should not detect another block', t => {
    const entity1 = new BemEntity({ block: 'block1' });
    const entity2 = new BemEntity({ block: 'block2' });

    t.false(entity1.isEqual(entity2));
});
