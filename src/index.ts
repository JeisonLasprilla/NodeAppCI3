import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {user_router} from './routes/user.router';
import {comment_router} from './routes/comment.router';
import auth from './middlewares/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URL as string)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error de conexión a MongoDB:', error));

// Rutas
app.use('/api/users', user_router);
app.use('/api/comments', comment_router);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});