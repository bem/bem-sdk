import './globals.d';

declare class BemEntityName {
    constructor(obj: BemSDK.EntityName.Options);

    readonly block: BemSDK.EntityName.BlockName;
    readonly elem: BemSDK.EntityName.ElementName | undefined;
    readonly mod: BemSDK.EntityName.Modifier | undefined;
    readonly modName: BemSDK.EntityName.ModifierName | undefined;
    readonly modVal: BemSDK.EntityName.ModifierValue | undefined;
    readonly type: BemSDK.EntityName.Type;
    readonly scope: BemEntityName | null;
    readonly id: BemSDK.EntityName.Id;

    isSimpleMod(): boolean | null;
    isEqual(entityName: BemEntityName): boolean;
    belongsTo(entityName: BemEntityName): boolean;
    valueOf(): BemSDK.EntityName.Representation;
    toJSON(): BemSDK.EntityName.Representation;
    toString(): string;
    inspect(depth: number, options: object): string;

    static create(obj: BemSDK.EntityName.CreateOptions | string): BemEntityName;
    static isBemEntityName(entityName: any): boolean;
}

export = BemEntityName;
