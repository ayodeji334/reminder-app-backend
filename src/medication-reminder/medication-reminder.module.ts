import { Module } from '@nestjs/common';
import { MedicationReminderService } from './medication-reminder.service';
import { MedicationReminderController } from './medication-reminder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationReminder } from './entities/medication-reminder.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [MedicationReminderController],
  providers: [MedicationReminderService],
  imports: [TypeOrmModule.forFeature([MedicationReminder]), UsersModule],
  exports: [TypeOrmModule],
})
export class MedicationReminderModule {}
