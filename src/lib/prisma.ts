// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// PrismaClient initialization with better error handling
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  errorFormat: 'pretty',
});

// Add connection retry logic for better resilience
async function connectWithRetry(retries = 5, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting database connection (attempt ${i + 1}/${retries})...`);
      await prisma.$connect();
      console.log('Successfully connected to database');
      return;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error);
      
      if (i < retries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
      } else {
        console.error('Max retries reached. Could not connect to database.');
        throw error;
      }
    }
  }
}

// Initialize connection
if (process.env.NODE_ENV === 'production') {
  connectWithRetry()
    .catch(e => {
      console.error('Fatal database connection error:', e);
    });
}

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;