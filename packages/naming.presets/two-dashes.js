import origin from './origin.js';

export default Object.assign({}, origin, {
    delims: {
        elem: '__',
        mod: { name: '--', val: '_' }
    }
});
