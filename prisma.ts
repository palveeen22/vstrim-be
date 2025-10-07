import { PrismaClient } from '@prisma/client';

// Determine if running in Docker by checking for a Docker-specific env variable
const isRunningInDocker = process.env.DOCKER_CONTAINER === 'true' ||
  process.env.NODE_ENV === 'production';

// Use the appropriate connection URL
const databaseUrl = isRunningInDocker
  ? process.env.DATABASE_URL_DOCKER || process.env.DATABASE_URL
  : process.env.DATABASE_URL;

  console.log(databaseUrl, "<<<");
// Initialize Prisma client with the determined connection string
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma