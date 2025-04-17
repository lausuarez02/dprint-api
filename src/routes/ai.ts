import { FastifyInstance } from 'fastify';
import aiService from '../services/aiService';
import logger from '../utils/logger';

// Request body types
interface GenerateTextRequest {
  prompt: string;
  model?: string;
}

interface GenerateEmbeddingRequest {
  text: string;
  model?: string;
}

// Route registration
export default async function (fastify: FastifyInstance): Promise<void> {
  // Generate text using AI
  fastify.post<{ Body: GenerateTextRequest }>(
    '/generate-text',
    {
      schema: {
        body: {
          type: 'object',
          required: ['prompt'],
          properties: {
            prompt: { type: 'string' },
            model: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              content: { type: 'string' },
              model: { type: 'string' },
              created: { type: 'number' }
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { prompt, model } = request.body;
        const response = await aiService.generateText(prompt, model);
        reply.send(response);
      } catch (error) {
        logger.error({ error, body: request.body }, 'Error in /generate-text endpoint');
        reply.status(400).send({
          error: error instanceof Error ? error.message : 'Failed to generate text'
        });
      }
    }
  );

  // Generate embedding using AI
  fastify.post<{ Body: GenerateEmbeddingRequest }>(
    '/generate-embedding',
    {
      schema: {
        body: {
          type: 'object',
          required: ['text'],
          properties: {
            text: { type: 'string' },
            model: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              embedding: { 
                type: 'array',
                items: { type: 'number' }
              }
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { text, model } = request.body;
        const embedding = await aiService.generateEmbedding(text, model);
        reply.send({ embedding });
      } catch (error) {
        logger.error({ error, body: request.body }, 'Error in /generate-embedding endpoint');
        reply.status(400).send({
          error: error instanceof Error ? error.message : 'Failed to generate embedding'
        });
      }
    }
  );
} 