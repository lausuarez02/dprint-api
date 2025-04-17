import dotenv from 'dotenv';
import type { AppConfig } from '../types/index';

// Load environment variables from .env file
dotenv.config();

// Default configuration
const defaultConfig: AppConfig = {
  SOLANA_RPC_URL: 'https://api.devnet.solana.com',
  OPENAI_API_KEY: '',
  PORT: 3000,
  NODE_ENV: 'development'
};

// Get configuration from environment
const config: AppConfig = {
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || defaultConfig.SOLANA_RPC_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || defaultConfig.OPENAI_API_KEY,
  PORT: parseInt(process.env.PORT || String(defaultConfig.PORT), 10),
  NODE_ENV: process.env.NODE_ENV || defaultConfig.NODE_ENV
};

// Validate required configuration
const validateConfig = (): void => {
  if (!config.SOLANA_RPC_URL) {
    throw new Error('SOLANA_RPC_URL is required');
  }
  
  if (!config.OPENAI_API_KEY && config.NODE_ENV === 'production') {
    throw new Error('OPENAI_API_KEY is required in production mode');
  }
};

export { config, validateConfig }; 