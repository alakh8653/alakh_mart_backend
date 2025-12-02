let prismaClient = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prismaClient = new PrismaClient();
} catch (err) {
  // Prisma not installed or DATABASE_URL not set; falling back to null.
  prismaClient = null;
}

module.exports = prismaClient;
