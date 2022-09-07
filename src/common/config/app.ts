import { AppInterface } from '../interfaces/app.interface';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): AppInterface => ({
    NODE_ENV: process.env.NODE_ENV,
  }),
);
