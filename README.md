# Solana & AI API

A TypeScript API server built with Fastify that interacts with Solana blockchain and provides AI features.

## Features

- Solana blockchain interactions using `@solana/web3.js`
- AI integrations using OpenAI API
- RESTful API with Fastify
- Swagger documentation
- TypeScript support
- Structured logging with Pino

## Project Structure

```
├── src/
│   ├── server.ts              # Entry point
│   ├── routes/
│   │   ├── solana.ts          # Solana endpoints
│   │   └── ai.ts              # AI endpoints
│   ├── services/
│   │   ├── solanaService.ts   # Solana blockchain logic
│   │   └── aiService.ts       # AI interaction logic
│   ├── utils/
│   │   ├── logger.ts          # Logging utility
│   │   └── config.ts          # Configuration management
│   └── types/
│       └── index.d.ts         # Type definitions
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd solana-ai-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```
   SOLANA_RPC_URL=<your-solana-rpc-url>
   OPENAI_API_KEY=<your-openai-api-key>
   ```

### Development

Run the development server:
```
npm run dev
```

### Production

Build and start the production server:
```
npm run build
npm start
```

## API Documentation

When the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/docs
```

## Endpoints

### Solana Endpoints

- `GET /solana/balance/:address` - Get SOL balance for a wallet address
- `GET /solana/transaction/:signature` - Get transaction details

### AI Endpoints

- `POST /ai/generate-text` - Generate text using OpenAI
- `POST /ai/generate-embedding` - Generate embeddings for text

## License

MIT 