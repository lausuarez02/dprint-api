// Environment configuration types
interface AppConfig {
  SOLANA_RPC_URL: string;
  OPENAI_API_KEY: string;
  PORT: number;
  NODE_ENV: string;
}

// Solana types
interface SolanaTransactionResult {
  signature: string;
  success: boolean;
  error?: string;
}

// AI response types
interface AIResponse {
  id: string;
  content: string;
  model: string;
  created: number;
}

export { AppConfig, SolanaTransactionResult, AIResponse }; 