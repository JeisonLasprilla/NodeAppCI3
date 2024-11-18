import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { user_router } from './routes/user.router';
import { comment_router } from './routes/comment.router';

console.log('Iniciando aplicación...');

dotenv.config();
console.log('Variables de entorno:', {
    MONGODB_URL: process.env.MONGODB_URL ? 'Definida' : 'No definida',
    PORT: process.env.PORT
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

console.log('Intentando conectar a MongoDB...');
console.log('MongoDB URL:', process.env.MONGODB_URL ? 'Definida' : 'No definida');
mongoose.connect(process.env.MONGODB_URL as string)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => {
        console.error('Error de conexión a MongoDB:', error);
        process.exit(1); // Termina el proceso si no puede conectar
    });

app.use('/api/users', user_router);
app.use('/api/comments', comment_router);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
