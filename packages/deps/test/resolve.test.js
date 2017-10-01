'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const resolve = require('..').resolve;

describe('resolve', () => {
    it('should return result containing entities and dependOn sections', () => {
        const resolved = resolve();

        expect(resolved).to.have.all.keys(['entities', 'dependOn']);
    });

    it('should return empty entities if no args passed', () => {
        const resolved = resolve();

        expect(resolved.entities).to.be.empty;
    });

    it('should return empty dependOn if decl is not specified or empty', () => {
        const resolved = resolve();

        expect(resolved.dependOn).to.be.empty;
    });

    it('should return empty dependOn for any decl if deps is not specified or empty', () => {
        const decl = [{ block: 'A' }],
            resolved = resolve(decl);

        expect(resolved.dependOn).to.be.empty;
    });

    it('should return empty dependOn for any decl and deps if opts are not specified', () => {
        const decl = [{ block: 'A' }],
            deps = [
                {
                    vertex: { entity: { block: 'A' } },
                    dependOn: { entity: { block: 'B' } }
                }
            ],
            resolved = resolve(decl, deps);

        expect(resolved.dependOn).to.be.empty;
    });

    it('should return identical decl if no deps are specified', () => {
        const decl = [{ block: 'A' }],
            resolved = resolve(decl);

        expect(resolved.entities).to.be.deep.equal(decl);
    });

    it('should allow to specify single-element deps graph as object', () => {
        const decl = [{ block: 'A' }],
            depsItem = {
                vertex: { entity: { block: 'A' } },
                dependOn: { entity: { block: 'B' } }
            },
            resolvedDepsArray = resolve(decl, [depsItem]),
            resolvedDepsObject = resolve(decl, depsItem);

        expect(resolvedDepsArray).to.be.deep.equal(resolvedDepsObject);
    });

    it('should not return dependOn with tech match', () => {
        const decl = [{ block: 'A' }],
            depsItem = {
                vertex: { entity: { block: 'A' }, tech: 'js' },
                dependOn:
                    { entity: { block: 'B' }, tech: 'bemhtml.js' }
            },
            resolvedDepsObject = resolve(decl, depsItem, { tech: 'js' });

        expect(resolvedDepsObject).to.deep.equal({
            entities: [{ block: 'A' }],
            dependOn: [
                {
                    tech: 'bemhtml.js',
                    entities: [
                        { block: 'B' }
                    ]
                }
            ]
        });
    });

    it('should not return dependOn with tech doesnt match', () => {
        const decl = [{ block: 'A' }],
            depsItem = {
                vertex: { entity: { block: 'A' }, tech: 'bemhtml.js' },
                dependOn:
                    { entity: { block: 'B' }, tech: 'bemhtml.js' }
            },
            resolvedDepsObject = resolve(decl, depsItem, { tech: 'bemjson.js' });

        expect(resolvedDepsObject).to.deep.equal({
            entities: [{ block: 'A' }],
            dependOn: []
        });
    });

    it('should return identical decl for specific tech for unspecified deps declaration', () => {
        const decl = [{ block: 'A' }],
            resolved = resolve(decl, undefined, { tech: 'css' });

        expect(resolved.entities).to.be.deep.equal(decl);
    });

    it('should return identical decl for specific tech for empty deps declaration', () => {
        const decl = [{ block: 'A' }],
            resolved = resolve(decl, [], { tech: 'css' });

        expect(resolved.entities).to.be.deep.equal(decl);
    });
});
