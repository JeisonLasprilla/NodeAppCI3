import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { createApolloServer } from './apollo';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createServer } from 'http';

const app = express();
const PORT = process.env.PORT || 3000;

// Crear una única instancia del servidor HTTP
const httpServer = createServer(app);

async function startServer() {
  try {
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
