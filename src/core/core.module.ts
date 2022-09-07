import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import * as ENV_CONST from '../common/constants/environment';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('CONFIG ', configService.get(ENV_CONST.JWT_CONFIG_NAMESPACE));
        console.log('CONFIG ', configService.get(`${ENV_CONST.JWT_CONFIG_NAMESPACE}.secret`));
        return {
          secret: '' + configService.get<string>(`${ENV_CONST.JWT_CONFIG_NAMESPACE}.secret`)
        }
      }
    }),
  ],
  exports: [JwtModule]
})
export class CoreModule {}