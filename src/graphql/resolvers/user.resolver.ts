import UserService from '../../services/User.service';
import { GraphQLError } from 'graphql';
import { Context } from '../context';

const userService = UserService;

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) throw new GraphQLError('No autenticado', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
      return await userService.findById(context.user.user_id);
    },
    users: async (_: any, __: any, context: Context) => {
      if (!context.user || context.user.role !== 'superadmin') {
        throw new GraphQLError('No autorizado', {
          extensions: { code: 'UNAUTHORIZED' }
        });
      }
      return await userService.findAll();
    },
    user: async (_: any, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new GraphQLError('No autenticado', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
      return await userService.findById(id);
    }
  },
  Mutation: {
    register: async (_: any, { input }: any) => {
      const user = await userService.create(input);
      const { token } = await userService.login({
        email: input.email,
        password: input.password
      });
      return { token, user };
    },
    login: async (_: any, { input }: any) => {
      const { email, token } = await userService.login(input);
      const user = await userService.findByEmail(email);
      return { token, user };
    }
  }
};