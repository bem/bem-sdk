import normalize1 from './normalize-v1';
import normalize2 from './normalize-v2';

export default {
    normalize: function (entities, version) {
        return version === '1.0' ? normalize1(entities) : normalize2(entities);
    }
};
