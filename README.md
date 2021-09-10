<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
  <a href="http://parseplatform.org" target="blank"><img src="https://parseplatform.org/img/logo.svg" width="320" alt="Parse Logo" /></a>
</p>


## Description

Nest framework with Parse-server and parse-dashboard

# Getting Started

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

# start from scratch

### create next app

```
yarn global add @nestjs/cli
nest new project-name

# install module
yarn add nest-parse-server
```

setup module

```
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ParseServerModule } from 'nest-parse-server';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
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
            get (target, property) {
                if (typeof property === 'string') {
                    return { '*': ['ACL'], 'authenticated': ['ACL'] };
                }
            }})
        }
      },
      inject: [ConfigService],
    })]
})
export class AppModule {}
```

minimal file .env, for more details https://www.yarnjs.com/package/nest-parse-server
```
PARSE_SERVER_APP_NAME=YOUR_APP_NAME
PARSE_SERVER_APPLICATION_ID=YOUR_APP_ID
PARSE_SERVER_MASTER_KEY=YOUR_MASTER_KEY
PARSE_SERVER_DATABASE_URI=postgres://YOUR_DATABASE_USER:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE?stringtype=unspecified&timezone=Asia/Shanghai&application_name=parse

PARSE_SERVER_MOUNT_PATH=/paaaarse
SERVER_URL=http://localhost:3000/paaaarse
PARSE_PUBLIC_SERVER_URL=http://localhost:3000/paaaarse

PARSE_SERVER_ALLOW_ORIGIN=*

PARSE_SERVER_MOUNT_GRAPHQL=true
PARSE_SERVER_GRAPHQL_PATH=/graaaaaaaaaaphql

PARSE_DASHBOARD_MOUNTPATH=/dashboard
PARSE_DASHBOARD_APP_NAME=YOUR_APP_NAME
PARSE_DASHBOARD_USERNAME=admin
PARSE_DASHBOARD_PASSWORD=admin
```

### start server

this minimal system only use postgis

```
docker-compose up -d postgis
yarn run start:dev
```

open http://localhost:3000/dashboard to explore, username and password is admin/admin

