import assert from 'node:assert';
import { inspect, type InspectOptionsStylized } from 'node:util';

export type KeyValue = string;
export type PluralForm = 'one' | 'some' | 'many' | 'none';
export type PluralForms = Partial<Record<PluralForm, Key>>;

export class Key {
  readonly name: string;
  readonly value: KeyValue | PluralForms;

  constructor(name: string, value: KeyValue | PluralForms) {
    assert(typeof name === 'string', 'Key name should be string');
    this.name = name;
    this.value = value;
  }

  toString(): string {
    return String(this.value);
  }

  valueOf(): KeyValue | PluralForms {
    return this.value;
  }

  toJSON(): KeyValue | PluralForms {
    return this.valueOf();
  }

  [inspect.custom](_depth: number, options: InspectOptionsStylized): string {
    const stringRepresentation = inspect(this.valueOf(), options);
    return `${this.constructor.name} { name: '${this.name}', value: ${stringRepresentation} }`;
  }
}

export class ParamedKey extends Key {
  readonly params: string[];

  constructor(name: string, value: KeyValue, params: string[] = []) {
    super(name, value);

    const errors: string[] = [];
    for (const param of params) {
      if (!String(value).includes(param)) {
        errors.push(`Key: value should include param: ${param}`);
      }
    }
    assert(errors.length === 0, errors.join('\n'));
    this.params = params;
  }
}

export class PluralKey extends Key {
  readonly forms: PluralForms;

  constructor(name: string, value: PluralForms) {
    super(name, value);
    this.forms = value;
  }
}
