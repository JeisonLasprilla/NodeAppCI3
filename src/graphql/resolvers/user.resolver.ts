import dotenv from 'dotenv';
dotenv.config();

import UserService from '../../services/User.service';
import { GraphQLError } from 'graphql';
import { Context } from '../context';
import jwt from 'jsonwebtoken';

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
      try {
        console.log('Contexto recibido:', context);
        
        if (!context.user || context.user.role !== 'superadmin') {
          throw new GraphQLError('No autorizado', {
            extensions: { code: 'UNAUTHORIZED' }
          });
        }
        
        const users = await userService.findAll();
        console.log('Usuarios encontrados:', users.length);
        return users;
      } catch (error) {
        console.error('Error en resolver users:', error);
        throw error;
      }
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
      try {
        console.log('Iniciando registro de usuario:', input.email);
        const user = await userService.create(input);
        console.log('Usuario creado exitosamente');
        
        // Verificar que JWT_SECRET existe
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT_SECRET no está configurado');
        }
        
        // Generar token
        const token = jwt.sign(
          { 
            user_id: user._id, 
            email: user.email,
            role: user.role 
          },
          jwtSecret,
          { expiresIn: "1h" }
        );

        return { token, user };
      } catch (error) {
        console.error('Error en registro:', error);
        if (error instanceof Error) {
          if (error.message.includes('user already exists')) {
            throw new GraphQLError('El usuario ya existe', {
              extensions: { 
                code: 'USER_EXISTS',
                originalError: error
              }
            });
          }
          throw new GraphQLError(error.message || 'Error en registro', {
            extensions: { 
              code: 'REGISTRATION_ERROR',
              originalError: error
            }
          });
        }
        throw new GraphQLError('Error desconocido en registro', {
          extensions: { code: 'REGISTRATION_ERROR' }
        });
      }
    },
    login: async (_: any, { input }: any) => {
      try {
        const loginResponse = await userService.login(input);
        return {
          token: loginResponse.token,
          user: await userService.findByEmail(loginResponse.email)
        };
      } catch (error) {
        console.error('Error en login resolver:', error);
        throw error;
      }
    },
    deleteUser: async (_: any, { id }: { id: string }, context: Context) => {
      try {
        console.log('=== DEBUG DELETE USER RESOLVER ===');
        console.log('1. ID a eliminar:', id);
        console.log('2. Contexto del usuario:', context.user);

        // Verificar autenticación
        if (!context.user) {
          throw new GraphQLError('No autenticado', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }
        
        // Verificar autorización
        if (context.user.role !== 'superadmin') {
          throw new GraphQLError('No autorizado', {
            extensions: { code: 'UNAUTHORIZED' }
          });
        }

        // Verificar que no se intente eliminar al propio superadmin
        if (id === context.user.user_id) {
          throw new GraphQLError('No puedes eliminar tu propia cuenta de superadmin', {
            extensions: { code: 'FORBIDDEN_OPERATION' }
          });
        }

        const result = await userService.delete(id);
        console.log('3. Resultado de la eliminación:', result);

        return result;
      } catch (error) {
        console.error('4. Error en deleteUser resolver:', error);
        throw new GraphQLError('Error al eliminar usuario', {
          extensions: { 
            code: 'DELETE_ERROR',
            originalError: error
          }
        });
      }
    },
    updateUser: async (_: any, { id, input }: { id: string, input: any }, context: Context) => {
      try {
        console.log('=== DEBUG UPDATE USER ===');
        console.log('1. ID a actualizar:', id);
        console.log('2. Datos a actualizar:', input);

        // Verificar autenticación
        if (!context.user) {
          throw new GraphQLError('No autenticado', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }

        // Solo el superadmin o el propio usuario pueden actualizar
        if (context.user.role !== 'superadmin' && context.user.user_id !== id) {
          throw new GraphQLError('No autorizado', {
            extensions: { code: 'UNAUTHORIZED' }
          });
        }

        const result = await userService.update(id, input);
        console.log('3. Resultado de la actualización:', result);

        return result;
      } catch (error) {
        console.error('4. Error en updateUser resolver:', error);
        throw new GraphQLError('Error al actualizar usuario', {
          extensions: { 
            code: 'UPDATE_ERROR',
            originalError: error
          }
        });
      }
    }
  }
};