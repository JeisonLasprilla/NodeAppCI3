import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { Context } from './graphql/context';
import { PubSub } from 'graphql-subscriptions';
import auth from './middlewares/auth';
import UserService from './services/User.service';
import CommentService from './services/Comment.service';
import ReactionService from './services/Reaction.service';
import createContext from './graphql/context';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { authDirectiveTransformer } from './graphql/directives/auth.directive';

const pubsub = new PubSub();

export const createApolloServer = async () => {
  let schema = makeExecutableSchema({ typeDefs, resolvers });
  schema = authDirectiveTransformer(schema);

  const server = new ApolloServer<Context>({
    schema
  });

  await server.start();

  const middleware = expressMiddleware(server, {
    context: async ({ req }) => {
      const baseContext = await createContext();
      try {
        if (req.headers.authorization) {
          await new Promise<void>((resolve, reject) => {
            auth(req, {
              status: () => ({ json: () => {} }),
              json: () => {}
            } as any, (error: any) => {
              if (error) reject(error);
              resolve();
            });
          });
        }
        
        return {
          ...baseContext,
          user: req.user,
          dataSources: {
            userService: UserService,
            commentService: CommentService,
            reactionService: ReactionService
          }
        };
      } catch (error) {
        return {
          ...baseContext,
          dataSources: {
            userService: UserService,
            commentService: CommentService,
            reactionService: ReactionService
          }
        };
      }
    }
  });

  return { server, middleware };
}; 