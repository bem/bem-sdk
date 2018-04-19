declare module '@bem/sdk.naming.presets' {
    interface INamingConventionDelims {
        elem: string;
        mod: string | {
            name: string;
            val: string;
        };
    }

    export interface INamingConvention {
        delims: INamingConventionDelims;
        fs: {
            pattern: string;
            scheme: string;
            delims: INamingConventionDelims;
        };
        wordPattern: string;
    }

    // TODO: Add export for two-dashes (https://github.com/bem/bem-sdk/issues/315)
    export const react: INamingConvention;
    export const origin: INamingConvention;
}
