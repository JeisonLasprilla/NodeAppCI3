// src/routes/user.router.ts
import express from 'express';
import UserController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth';
import validateSchema from '../middlewares/validateSchema';
import userSchema from '../schemas/user.schema';

export const user_router = express.Router();

// Rutas públicas
user_router.post('/login', UserController.login);

// Rutas protegidas
//router.use(authMiddleware);

// Ruta para obtener todos los usuarios (solo para usuarios autenticados)
user_router.get('/', UserController.getAll);

// Ruta para obtener el perfil del usuario autenticado
user_router.get('/profile', UserController.getUser);

// Rutas que requieren ser superadmin
//router.post('/', authMiddleware.isSuperAdmin, validateSchema(userSchema), UserController.create);
user_router.post('/', validateSchema(userSchema), UserController.create);
user_router.put('/:id', authMiddleware.isSuperAdmin, validateSchema(userSchema), UserController.update);
user_router.delete('/:id', authMiddleware.isSuperAdmin, UserController.delete);

// Ruta para obtener un usuario específico (accesible para todos los usuarios autenticados)
user_router.get('/:id', UserController.getUser);