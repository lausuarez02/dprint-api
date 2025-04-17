import pino from 'pino';
import { config } from './config';

// Configure logger options
const loggerOptions = {
  level: config.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: config.NODE_ENV === 'development' 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      } 
    : undefined
};

// Create and export the logger instance
const logger = pino(loggerOptions);

export default logger; 