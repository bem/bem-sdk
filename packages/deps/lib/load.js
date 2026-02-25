import read from './read.js';
import parse from './parse.js';
import gather from './gather.js';
import defaultFormat from './formats/deps.js/index.js';

export default function (config, format) {
    format || (format = defaultFormat);

    return gather(config)
        .then(read(format.reader))
        .then(parse(format.parser));
}
