// src/routes/comment.router.ts
import express from 'express';
import CommentController from '../controllers/comment.controller';
import auth from '../middlewares/auth';
import validateSchema from '../middlewares/validateSchema';
import commentSchema from '../schemas/comment.schema';

export const comment_router = express.Router();

// Todas las rutas de comentarios requieren autenticación
router.use(auth);

// Obtener todos los comentarios
router.get('/', CommentController.getAll);

// Crear un nuevo comentario
router.post('/', validateSchema(commentSchema), CommentController.create);

// Obtener, actualizar o eliminar un comentario específico
router.get('/:id', CommentController.getComment);
router.put('/:id', validateSchema(commentSchema), CommentController.update);
router.delete('/:id', CommentController.delete);

// Responder a un comentario
router.post('/:id/reply', validateSchema(commentSchema), CommentController.reply);

// Reaccionar a un comentario
router.post('/:id/react', CommentController.react);
router.delete('/:id/react', CommentController.removeReaction);