import test from 'ava';

import BemEntity from '../index';

test('should throw error for if entity object is not valid', t => {
    t.throws(
        () => {
            /*eslint no-new: 0*/
            new BemEntity({ elem: 'elem' });
        },
        'This is not valid BEM entity: the field `block` is undefined.'
    );
});
