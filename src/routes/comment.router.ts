import express from 'express';
import CommentController from '../controllers/comment.controller';
import authMiddleware from '../middlewares/auth';

export const comment_router = express.Router();

// Todas las rutas de comentarios requieren autenticación
comment_router.use(authMiddleware);

comment_router.post('/', CommentController.create);
comment_router.get('/', CommentController.getAllComments);
comment_router.get('/:id', CommentController.getComment);
comment_router.put('/:id', CommentController.updateComment);
comment_router.delete('/:id', CommentController.deleteComment);

// Rutas para reacciones
comment_router.post('/:commentId/reactions', CommentController.addReaction);
comment_router.delete('/:commentId/reactions', CommentController.removeReaction);