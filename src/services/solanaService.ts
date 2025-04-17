import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { config } from '../utils/config';
import logger from '../utils/logger';
import type { SolanaTransactionResult } from '../types/index';

class SolanaService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(config.SOLANA_RPC_URL, 'confirmed');
  }

  /**
   * Get account balance for a specific public key
   */
  async getBalance(publicKeyStr: string): Promise<number> {
    try {
      const publicKey = new PublicKey(publicKeyStr);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 10 ** 9; // Convert lamports to SOL
    } catch (error) {
      logger.error({ error }, 'Error getting account balance');
      throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Send SOL from one account to another
   */
  async transferSol(
    fromKeypair: Keypair,
    toPublicKeyStr: string,
    amount: number
  ): Promise<SolanaTransactionResult> {
    try {
      const toPublicKey = new PublicKey(toPublicKeyStr);
      const lamports = amount * 10 ** 9; // Convert SOL to lamports

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPublicKey,
          lamports
        })
      );

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [fromKeypair]
      );

      logger.info({ signature }, 'Transaction successful');
      
      return {
        signature,
        success: true
      };
    } catch (error) {
      logger.error({ error }, 'Error sending transaction');
      
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Get transaction details by signature
   */
  async getTransaction(signature: string): Promise<any> {
    try {
      const transaction = await this.connection.getTransaction(signature);
      return transaction;
    } catch (error) {
      logger.error({ error, signature }, 'Error fetching transaction');
      throw new Error(`Failed to get transaction: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export default new SolanaService(); 