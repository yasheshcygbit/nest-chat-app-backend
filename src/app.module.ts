import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import database from './common/config/database';
import * as ENV_CONST from './common/constants/environment';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { ConnectionRequestModule } from './connection-request/connection-request.module';
import { ConnectionRequest } from './connection-request/connection-request.entity';
import { ConnectionModule } from './connection/connection.module';
import { Connection } from './connection/connection.entity';

const isProductionMode = process.env.NODE_ENV === ENV_CONST.ENV_MODE_PRODUCTION;

const envFilePath = isProductionMode
  ? ENV_CONST.ENV_PATH_PROD
  : ENV_CONST.ENV_PATH_DEV;

console.log('envFilePath', envFilePath);
  

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      expandVariables: true,
      load: [
        database
      ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'postgres',
          host: configService.get<string>(
            `${ENV_CONST.DATABASE_NAMESPACE}.host`,
          ),
          port: configService.get<number>(
            `${ENV_CONST.DATABASE_NAMESPACE}.port`,
          ),
          username: configService.get<string>(
            `${ENV_CONST.DATABASE_NAMESPACE}.username`,
          ),
          password: configService.get<string>(
            `${ENV_CONST.DATABASE_NAMESPACE}.password`,
          ),
          database: configService.get<string>(
            `${ENV_CONST.DATABASE_NAMESPACE}.database`,
          ),
          entities: [
            User,
            ConnectionRequest,
            Connection
          ],
          synchronize: true,
        }
      }
    }),
    UsersModule,
    AuthModule,
    CoreModule,
    ConnectionRequestModule,
    ConnectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          method: RequestMethod.POST,
          path: '/auth/login'
        },
        {
          method: RequestMethod.POST,
          path: '/auth/register'
        }
      )
      .forRoutes(
        'users',
        'auth',
        'connection-request',
        'connection',
      )
  }
}
