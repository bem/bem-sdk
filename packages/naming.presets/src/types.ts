export type Mod = {
    name: string;
    val: string;
};

export interface INamingConventionDelims {
    elem: string;
    mod?: Mod | string;
}

export type FileSystem = {
    delims?: INamingConventionDelims;
    pattern: string;
    scheme: string;
};

export interface INamingConvention {
    delims: INamingConventionDelims;
    fs: FileSystem;
    wordPattern: string;
}

export type Presets = {
    [key: string]: INamingConvention
};
