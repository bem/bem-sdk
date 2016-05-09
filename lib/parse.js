import stream from 'stream';
import defaultParser from './formats/deps.js/parser';

export default function parse(parser=defaultParser) {
    var transform = new stream.Transform({ objectMode: true });

    transform._transform = function (entityDeps, encoding, done) {
        this.push(parser(entityDeps));
        done();
    };

    return transform;
}
