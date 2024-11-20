import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { Context } from './graphql/context';
import { PubSub } from 'graphql-subscriptions';
import auth from './middlewares/auth';

const pubsub = new PubSub();

export const createApolloServer = async () => {
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  await server.start();

  const middleware = expressMiddleware(server, {
    context: async ({ req }) => {
      try {
        if (req.headers.authorization) {
          await new Promise<void>((resolve, reject) => {
            auth(req, {} as any, (error: any) => {
              if (error) reject(error);
              resolve();
            });
          });
        }
        
        return {
          user: req.user,
          pubsub
        };
      } catch (error) {
        return { pubsub };
      }
    }
  });

  return { server, middleware };
}; 