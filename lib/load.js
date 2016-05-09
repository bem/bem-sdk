import read from './read';
import parse from './parse';
import defaultFormat from './formats/deps.js';

export default function (config, format=defaultFormat) {
    return read(config, format.reader)
        .pipe(parse(format.parser));
}
