import OpenAI from 'openai';
import { config } from '../utils/config';
import logger from '../utils/logger';
import type { AIResponse } from '../types/index';

class AIService {
  private client: OpenAI | null = null;

  constructor() {
    if (config.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: config.OPENAI_API_KEY
      });
    } else {
      logger.warn('OpenAI API key not provided. AI features will be unavailable.');
    }
  }

  /**
   * Generate text completion using OpenAI API
   */
  async generateText(prompt: string, model: string = 'gpt-3.5-turbo'): Promise<AIResponse> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please provide a valid API key.');
    }

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
      });

      const result = response.choices[0].message;
      
      return {
        id: response.id,
        content: result.content || '',
        model: response.model,
        created: response.created
      };
    } catch (error) {
      logger.error({ error, prompt }, 'Error generating AI text');
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate an embedding for text using OpenAI API
   */
  async generateEmbedding(text: string, model: string = 'text-embedding-ada-002'): Promise<number[]> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please provide a valid API key.');
    }

    try {
      const response = await this.client.embeddings.create({
        model,
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      logger.error({ error }, 'Error generating embedding');
      throw new Error(`Embedding generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export default new AIService(); 