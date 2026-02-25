import BemEntity from '@bem/sdk.entity-name';
import { inspect } from 'node:util';

const b_ = BemEntity.create;

export default function bemeql(chai) {
    var Assertion = chai.Assertion;

    Assertion.addMethod('bemeql', function (obj) {

        if (Array.isArray(obj) && Array.isArray(this._obj)) {
            if (obj.length !== this._obj.length) {
                this.assert(false,
                    'expected #{act} to deeply equal #{exp}',
                    'expected #{act} to not deeply equal #{exp}',
                    obj.map(inspectEl),
                    this._obj.map(inspectEl),
                    true
                );
            }

            const bemObj = obj.map(b_);
            this.assert(
                bemObj.every((e, i) => e.isEqual ? e.isEqual(this._obj[i]) : false),
                'expected #{act} to deeply equal #{exp}',
                'expected #{act} to not deeply equal #{exp}',
                bemObj.map(inspectEl),
                this._obj.map(inspectEl),
                true
            );
        }

        function inspectEl(el) {
            return inspect(el, { breakLength: Infinity, maxArrayLength: null, depth: null });
        }

    });
}
