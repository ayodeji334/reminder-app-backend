import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskScheduleService } from './task-schedule/task-schedule.service';
import { TaskScheduleModule } from './task-schedule/task-schedule.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MedicationReminderModule } from './medication-reminder/medication-reminder.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    TaskScheduleModule,
    ScheduleModule.forRoot(),
    MedicationReminderModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: ['dist/**/*.entity.js'],
        synchronize: true,
        autoLoadEntities: true,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService, TaskScheduleService],
})
export class AppModule {}
