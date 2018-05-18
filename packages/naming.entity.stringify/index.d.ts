declare module '@bem/sdk.naming.entity.stringify' {
    import { INamingConvention } from '@bem/sdk.naming.presets';
    import { EntityName } from '@bem/sdk.entity-name';

    export default function stringifyWrapper(convention: INamingConvention): {
        (entity: EntityName.IOptions): string;
    };
}
