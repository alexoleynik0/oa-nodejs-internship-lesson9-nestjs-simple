import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from 'src/config/configuration';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        // type: configService.get<DatabaseType>('database.type'), // IDEA: make this work?
        url: configService.get<string>('database.url'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        connectTimeoutMS: 3000,
        useUnifiedTopology: true,
        entities: [__dirname + '/../**/*.entity.{ts,js}'], // NOTE: make sure the path is right
        synchronize: true, // NOTE: set `false` in prod so no index creation errors occur, run schema:sync command when needed
      }),
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
