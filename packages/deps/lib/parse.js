import defaultParser from './formats/deps.js/parser.js';

export default function parse(parser) {
    parser || (parser = defaultParser);

    return function (deps) {
        return new Promise(
            (resolve) => {
                resolve(parser(deps));
            }
        );
    };
}
