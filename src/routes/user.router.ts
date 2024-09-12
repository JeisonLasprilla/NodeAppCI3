// src/routes/user.router.ts
import express from 'express';
import UserController from '../controllers/user.controller';
import authMiddleware from '../middlewares/auth';
import validateSchema from '../middlewares/validateSchema';
import userSchema from '../schemas/user.schema';

export const user_router = express.Router();

// Rutas públicas
router.post('/login', UserController.login);

// Rutas protegidas
//router.use(authMiddleware);

// Ruta para obtener todos los usuarios (solo para usuarios autenticados)
router.get('/', UserController.getAll);

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', UserController.getUser);

// Rutas que requieren ser superadmin
//router.post('/', authMiddleware.isSuperAdmin, validateSchema(userSchema), UserController.create);
router.post('/', validateSchema(userSchema), UserController.create);
router.put('/:id', authMiddleware.isSuperAdmin, validateSchema(userSchema), UserController.update);
router.delete('/:id', authMiddleware.isSuperAdmin, UserController.delete);

// Ruta para obtener un usuario específico (accesible para todos los usuarios autenticados)
router.get('/:id', UserController.getUser);