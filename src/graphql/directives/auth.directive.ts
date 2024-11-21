import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLError } from 'graphql';

export function authDirectiveTransformer(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];

      if (authDirective) {
        const { requires } = authDirective;
        const { resolve = defaultFieldResolver } = fieldConfig;

        fieldConfig.resolve = async function (source, args, context, info) {
          if (!context.user) {
            throw new GraphQLError('No autenticado', {
              extensions: { code: 'UNAUTHENTICATED' }
            });
          }

          if (requires && !requires.includes(context.user.role)) {
            throw new GraphQLError('No autorizado', {
              extensions: { code: 'UNAUTHORIZED' }
            });
          }

          return await resolve(source, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
}
