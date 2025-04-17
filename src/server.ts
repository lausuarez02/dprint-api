import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import { config, validateConfig } from './utils/config';
import logger from './utils/logger';

// Route handlers
import solanaRoutes from './routes/solana';
import aiRoutes from './routes/ai';

// Initialize Fastify with custom logger
const server: FastifyInstance = Fastify({
  logger: logger
});

// Register plugins
async function registerPlugins(): Promise<void> {
  // Enable CORS
  await server.register(cors, {
    origin: true
  });

  // Swagger documentation
  await server.register(swagger, {
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Solana & AI API',
        description: 'API for Solana blockchain and AI interactions',
        version: '1.0.0'
      },
      host: `localhost:${config.PORT}`,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    },
    exposeRoute: true
  });
}

// Register routes
async function registerRoutes(): Promise<void> {
  server.register(solanaRoutes, { prefix: '/solana' });
  server.register(aiRoutes, { prefix: '/ai' });

  // Health check route
  server.get('/health', async () => {
    return { status: 'ok' };
  });
}

// Start the server
async function startServer(): Promise<void> {
  try {
    // Validate configuration
    validateConfig();

    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();

    // Start listening
    await server.listen({ port: config.PORT, host: '0.0.0.0' });
    
    const address = server.server.address();
    const port = typeof address === 'object' ? address?.port : config.PORT;
    
    logger.info(`Server listening on port ${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down server...');
  await server.close();
  process.exit(0);
});

// Start the server
startServer(); 