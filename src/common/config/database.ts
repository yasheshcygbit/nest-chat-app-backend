import { registerAs } from '@nestjs/config';

import { DatabaseInterface } from '../interfaces/database-connection.interface';

console.log('process.env.DATABASE_PASSWORD', process.env.DATABASE_PASSWORD);

export default registerAs (
  'database',
  (): DatabaseInterface => ({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME,
  }),
);
