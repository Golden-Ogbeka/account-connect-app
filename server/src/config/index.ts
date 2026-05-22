import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret:
    process.env.JWT_SECRET ??
    (() => {
      throw new Error('JWT_SECRET environment variable is required.');
    })(),
  appUrl: process.env.APP_URL || 'http://localhost',
  corsList: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
};
