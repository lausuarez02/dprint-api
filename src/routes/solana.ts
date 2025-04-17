import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import solanaService from '../services/solanaService';
import logger from '../utils/logger';

// Request parameter types
interface BalanceParams {
  address: string;
}

interface TransactionParams {
  signature: string;
}

// Route registration
export default async function (fastify: FastifyInstance): Promise<void> {
  // Get balance for a Solana account
  fastify.get<{ Params: BalanceParams }>(
    '/balance/:address',
    {
      schema: {
        params: {
          type: 'object',
          required: ['address'],
          properties: {
            address: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              address: { type: 'string' },
              balance: { type: 'number' }
            }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { address } = request.params;
        const balance = await solanaService.getBalance(address);
        
        reply.send({
          address,
          balance
        });
      } catch (error) {
        logger.error({ error, params: request.params }, 'Error in /balance endpoint');
        reply.status(400).send({
          error: error instanceof Error ? error.message : 'Failed to get balance'
        });
      }
    }
  );

  // Get transaction details by signature
  fastify.get<{ Params: TransactionParams }>(
    '/transaction/:signature',
    {
      schema: {
        params: {
          type: 'object',
          required: ['signature'],
          properties: {
            signature: { type: 'string' }
          }
        }
      }
    },
    async (request, reply) => {
      try {
        const { signature } = request.params;
        const transaction = await solanaService.getTransaction(signature);
        
        if (!transaction) {
          return reply.status(404).send({
            error: 'Transaction not found'
          });
        }
        
        reply.send({ transaction });
      } catch (error) {
        logger.error({ error, params: request.params }, 'Error in /transaction endpoint');
        reply.status(400).send({
          error: error instanceof Error ? error.message : 'Failed to get transaction'
        });
      }
    }
  );
} 