import origin from './origin.js';

export default Object.assign({}, origin, {
    fs: Object.assign({}, origin.fs, {
        pattern: '${entity}${layer?@${layer}}.${tech}',
    })
});
