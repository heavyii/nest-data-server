import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ParseServerModule } from 'nest-parse-server';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParseCloudModule } from './parse-cloud/parse-cloud.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ParseServerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          appName: configService.get<string>('PARSE_SERVER_APP_NAME'),
          appId: configService.get<string>('PARSE_SERVER_APPLICATION_ID'),
          databaseURI: configService.get<string>('PARSE_SERVER_DATABASE_URI'),
          masterKey: configService.get<string>('PARSE_SERVER_MASTER_KEY'),
          serverURL: configService.get<string>('SERVER_URL'),
          protectedFields: new Proxy({}, {
            // hide ACL
            get(target, property) {
                if (typeof property === 'string') {
                    return target[property] || { '*': ['ACL'] };
                }
            }})
        }
      },
      inject: [ConfigService],
    }),
    ParseCloudModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
