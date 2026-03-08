import app from './app';
import dotenv from 'dotenv';
import prisma from './utils/db';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  // Check DB logic or just simple boot message
  console.log(`NOVAX ERP Server is running on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL Database via Prisma');
  } catch (err) {
    console.error('Failed to connect to the database', err);
  }
});
