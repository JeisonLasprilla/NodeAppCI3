import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { createApolloServer } from './apollo';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createServer } from 'http';
import mongoose from 'mongoose';


const app = express();
const PORT = process.env.PORT || 3000;

// Crear una única instancia del servidor HTTP
const httpServer = createServer(app);

// Configurar la conexión a MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URL no está definida en las variables de entorno');
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('📦 Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

async function startServer() {
  try {
    // Conectar a MongoDB antes de iniciar el servidor
    await connectDB();

    // Crear e iniciar el servidor Apollo
    const { server: apolloServer, middleware } = await createApolloServer();

    // Configuración de WebSocket para suscripciones
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    });

    useServer({ schema }, wsServer);

    // Configurar middleware
    app.use('/graphql', 
      express.json(),
      middleware
    );

    // Iniciar el servidor HTTP
    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejar errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('Error no manejado:', error);
  process.exit(1);
});

startServer();
