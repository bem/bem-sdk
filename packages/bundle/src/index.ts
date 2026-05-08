import path from 'node:path';
import { strict as assert } from 'node:assert';

import { convert as bemjsonConvert } from '@bem/sdk.bemjson-to-decl';
import type { BemEntityName } from '@bem/sdk.entity-name';

export interface BemBundleOptions {
  levels?: string[];
  name?: string;
  path?: string;
  bemjson?: object;
  decl?: BemEntityName[];
  [key: string]: unknown;
}

export class BemBundle {
  private readonly _opts: BemBundleOptions;
  private readonly _isBundle = true;
  private _name?: string;
  private _decl?: BemEntityName[];

  constructor(opts: BemBundleOptions) {
    assert(opts.bemjson || opts.decl, 'BEMJSON or BEMDECL must be present');
    assert(
      !opts.bemjson || (typeof opts.bemjson === 'object'),
      'BEMJSON should be an object',
    );
    assert(
      !opts.levels || Array.isArray(opts.levels),
      'Levels must be array of string',
    );
    assert(opts.name || opts.path, 'Bundle name or path must be present');
    assert(
      !opts.path || typeof opts.path === 'string',
      'Path must be a string',
    );

    this._opts = opts;
  }

  get name(): string {
    if (this._opts.name !== undefined) return this._opts.name;
    if (this._name !== undefined) return this._name;
    this._name = path.basename(this._opts.path!).split('.')[0]!;
    return this._name;
  }

  get bemjson(): object | undefined {
    return this._opts.bemjson;
  }

  get decl(): BemEntityName[] {
    if (this._opts.decl) return this._opts.decl;
    if (this._decl) return this._decl;
    this._decl = bemjsonConvert(this._opts.bemjson);
    return this._decl;
  }

  get levels(): string[] {
    return this._opts.levels ?? [];
  }

  get path(): string {
    return this._opts.path ?? '.';
  }

  static isBundle(bundle: unknown): bundle is BemBundle {
    return Boolean(bundle && (bundle as { _isBundle?: boolean })._isBundle);
  }
}

export default BemBundle;
