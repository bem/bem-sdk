import origin from './origin.js';

export default Object.assign({}, origin, {
    delims: Object.assign({}, origin.delims, {
        elem: '-'
    }),
    fs: Object.assign({}, origin.fs, {
        delims: { elem: '' }
    }),
    wordPattern: '[a-zA-Z0-9]+'
});
