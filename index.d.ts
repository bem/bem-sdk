import './globals.d';

declare class BemEntityName {
    constructor(obj: BemSDK.EntityName.Options);

    readonly block: string;
    readonly elem: string | undefined;
    readonly mod: BemSDK.EntityName.ModifierRepresentation | undefined;
    readonly modName: string | undefined;
    readonly modVal: string | true | undefined;
    readonly id: string;
    readonly type: BemSDK.EntityName.TYPE;

    isSimpleMod(): boolean | null;
    belongsTo(entityName: BemEntityName): boolean;
    toString(): string;
    valueOf(): BemSDK.EntityName.StrictRepresentation;
    inspect(depth: number, options: object): string;
    toJSON(): BemSDK.EntityName.StrictRepresentation;
    isEqual(entityName: BemEntityName): boolean;

    static isBemEntityName(entityName: any): boolean;
    static create(obj: BemSDK.EntityName.NonStrictRepresentation | string): BemEntityName;
}

export = BemEntityName;
