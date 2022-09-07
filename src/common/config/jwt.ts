import { registerAs } from '@nestjs/config';
import { JwtInterface } from '../interfaces/jwtInterface';

console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);

export default registerAs (
  'jwt',
  (): JwtInterface => ({
    secret: process.env.JWT_SECRET,
  }),
);
