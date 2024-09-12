import express from 'express';
import CommentController from '../controllers/comment.controller';
import auth from '../middlewares/auth';
import validateSchema from '../middlewares/validateSchema';
import commentSchema from '../schemas/comment.schema';

export const comment_router = express.Router();

// Todas las rutas de comentarios requieren autenticación
//comment_router.use(auth);

// Obtener todos los comentarios
comment_router.get('/', CommentController.getAll);

// Crear un nuevo comentario
//comment_router.post('/', validateSchema(commentSchema), CommentController.create);
comment_router.post('/', CommentController.create);

// Obtener, actualizar o eliminar un comentario específico
comment_router.get('/:id', CommentController.getComment);
//comment_router.put('/:id', validateSchema(commentSchema), CommentController.update);
comment_router.put('/:id', CommentController.update);
comment_router.delete('/:id', CommentController.delete);

// Responder a un comentario
//comment_router.post('/:id/reply', validateSchema(commentSchema), CommentController.reply);
comment_router.post('/:id/reply', CommentController.reply);

// Reaccionar a un comentario
comment_router.post('/:id/react', CommentController.react);
comment_router.delete('/:id/react', CommentController.removeReaction);