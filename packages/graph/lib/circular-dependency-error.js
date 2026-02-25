/**
 * CircularDependencyError
 */
export default class CircularDependencyError extends Error {
    constructor(loop) {
        loop = Array.from(loop || []);

        let message = 'dependency graph has circular dependencies';
        if (loop.length) {
            message = `${message} (${loop.join(' <- ')})`;
        }

        super(message);

        this.name = this.constructor.name;
        this._loop = loop;
    }
    get loop() {
        return this._loop.map(item => {
            const res = {};
            item.entity && (res.entity = item.entity.valueOf());
            item.tech && (res.tech = item.tech);
            return res;
        });
    }
}
