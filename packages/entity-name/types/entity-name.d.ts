import './globals.d';

declare class BemEntityName {
    constructor(obj: BEMSDK.EntityName.Options);

    readonly block: BEMSDK.EntityName.BlockName;
    readonly elem: BEMSDK.EntityName.ElementName | undefined;
    readonly mod: BEMSDK.EntityName.Modifier | undefined;
    readonly modName: BEMSDK.EntityName.ModifierName | undefined;
    readonly modVal: BEMSDK.EntityName.ModifierValue | undefined;
    readonly type: BEMSDK.EntityName.Type;
    readonly scope: BemEntityName | null;
    readonly id: BEMSDK.EntityName.Id;

    isSimpleMod(): boolean | null;
    isEqual(entityName: BemEntityName): boolean;
    belongsTo(entityName: BemEntityName): boolean;
    valueOf(): BEMSDK.EntityName.Representation;
    toJSON(): BEMSDK.EntityName.Representation;
    toString(): string;
    inspect(depth: number, options: object): string;

    static create(obj: BEMSDK.EntityName.CreateOptions | string): BemEntityName;
    static isBemEntityName(entityName: any): boolean;
}

export = BemEntityName;
