import './globals.d';

declare class BemEntityName {
    constructor(obj: BemSDK.EntityName.Options);

    readonly block: string;
    readonly elem: string | undefined;
    readonly mod: BemSDK.EntityName.ModifierRepresentation | undefined;
    readonly modName: string | undefined;
    readonly modVal: string | true | undefined;
    readonly type: BemSDK.EntityName.TYPE;
    readonly id: string;

    isSimpleMod(): boolean | null;
    isEqual(entityName: BemEntityName): boolean;
    belongsTo(entityName: BemEntityName): boolean;
    valueOf(): BemSDK.EntityName.StrictRepresentation;
    toJSON(): BemSDK.EntityName.StrictRepresentation;
    toString(): string;
    inspect(depth: number, options: object): string;

    static create(obj: BemSDK.EntityName.NonStrictRepresentation | string): BemEntityName;
    static isBemEntityName(entityName: any): boolean;
}

export = BemEntityName;
