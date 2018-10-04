'use strict';

const fs = require('fs');
const { promisify } = require('util');
const { resolve, parse, join } = require('path');

const formats = require('./formats');
const { LangKeys } = require('./langKeys');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);

class Keyset {
    constructor(name, path, format) {
        this.name = name;

        this._landKeys = new Map();

        this.path = path;
        this.format = format || 'taburet';

        this.langsKeysExt = '.js';

        // TODO: process errors all across Keyset, Langkeys & Keys
        this.isBroken = false;
    }

    get langKeys() {
        return this._landKeys;
    }

    get langs() {
        return [...this.langKeys.keys()]
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
        if (this._path) {
            const p = parse(this._path)
            this._path = join(p.dir, name + p.ext);
        }
    }

    get path() {
        return this._path;
    }

    set path(path) {
        if (!path) {
            this._path = '';
            return;
        }
        this._name = parse(path).name;
        this._path = path;
    }

    set format(format) {
        if (!Keyset.availableFormats[format]) {
            throw new Error(`format ${format} is not valid, choose one of [${Object.keys(Keyset.availableFormats)}]`);
        }
        this._formatName = format;
        if (format === 'enb') {
            this.langsKeysExt = '.js';
        } else if (format === 'taburet') {
            this.langsKeysExt = '.ts';
        }
    }

    get format() {
        return this._formatName;
    }

    set isBroken(broken) {
        this._isBroken = broken;
        if (!broken) {
            this._errors = [];
        }
    }

    get isBroken() {
        if (this._errors.length) {
            this._isBroken = true;
        } else {
            this._isBroken = false;
        }
        return this._isBroken;
    }

    get errors() {
        return this._errors;
    }

    addKeysForLang(lang, keys) {
        if (!(keys instanceof LangKeys)) {
            throw new Error(`keys should be instance of LangKeys`);
        }

        keys.keyset = this;
        this.langKeys.set(lang, keys);
    }

    getLangKeysForLang(lang) {
        return this.langKeys.get(lang);
    }

    getKeysForLang(lang) {
        const langKeys = this.getLangKeysForLang(lang);
        if (langKeys) {
            return langKeys.keys;
        } else {
            return {};
        }
    }

    async save() {
        if (!this.path) {
            throw new Error(`To save keyset, set it path`);
        }
        try {
            await mkdir(this.path);
        } catch(err) {
            if (err.code === 'EEXIST') {
                const files = await readdir(resolve(this.path));
                for (let file of files) {
                    const filePath = resolve(this.path, file);
                    await unlink(filePath);
                }
            } else {
                throw err;
            }
        }

        this.isBroken = false;
        for (let [lang, langKeys] of this.langKeys) {
            try {
               const filePath = resolve(this.path, lang + this.langsKeysExt);
               try {
                   await writeFile(filePath, langKeys.stringify(this.format));
               } catch(err) {
                   throw err;
               }
            } catch(err) {
                this.errors.push(err);
            }
        }

        if (this.format === 'taburet') {
            const reExportStr = this.langs.reduce((acc, langFile) => {
                acc += `export * from './${langFile}';\n`;
                return acc;
            }, '');
            const filePath = resolve(this.path, 'index' + this.langsKeysExt);
            try {
                await writeFile(filePath, reExportStr);
            } catch(err) {
                this.errors.push(err);
            }
        }

        if (this.isBroken) {
            throw new Error(`Keyset saved with errors`);
        }
    }

    async load() {
        this.isBroken = false;

        let files = [];
        try {
            files = await readdir(resolve(this.path));
        } catch(err) {
            throw new Error(`${this.path} is not directory`);
        }

        for (let file of files) {
            const filePath = resolve(this.path, file);
            const lang = parse(file).name;
            let data = null;

            if (lang === 'index') {
                continue;
            }

            try {
                data = await readFile(filePath, 'utf8');
            } catch(err) {
                this.errors.push(new Error(`${filePath} is broken`));
                continue;
            }

            let langKeys = null;
            try {
                langKeys = await LangKeys.parse(data, this.format);
                langKeys.lang = lang;
                langKeys.keysetName = this.name;
            } catch (err) {
                this.errors.push(err);
                continue;
            }

            this.addKeysForLang(lang, langKeys);
        }

        if (this.isBroken) {
            throw new Error(`Keyset loaded with errors`);
        }
    }

    * [Symbol.iterator]() {
        for (let [lang, langKeys] of this.langKeys) {
            yield [lang, langKeys];
        }
    }

}

Keyset.availableFormats = formats;


module.exports = {
    Keyset
}
