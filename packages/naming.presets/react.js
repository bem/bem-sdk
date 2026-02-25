import base from './origin-react.js';

export default Object.assign({}, base, {
    fs: Object.assign({}, base.fs, {
        pattern: '${entity}${layer?@${layer}}.${tech}'
    })
});
