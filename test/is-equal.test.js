import test from 'ava';

import BemEntityName from '../index';

test('should detect equal block', t => {
    const entityName1 = new BemEntityName({ block: 'block' });
    const entityName2 = new BemEntityName({ block: 'block' });

    t.true(entityName1.isEqual(entityName2));
});

test('should not detect another block', t => {
    const entityName1 = new BemEntityName({ block: 'block1' });
    const entityName2 = new BemEntityName({ block: 'block2' });

    t.false(entityName1.isEqual(entityName2));
});
