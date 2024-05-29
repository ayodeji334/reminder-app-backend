import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMedicationReminderDto } from './dto/create-medication-reminder.dto';
import { UpdateMedicationReminderDto } from './dto/update-medication-reminder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicationReminder } from './entities/medication-reminder.entity';
import { Brackets, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as moment from 'moment';

@Injectable()
export class MedicationReminderService {
  constructor(
    @InjectRepository(MedicationReminder)
    private medicationReminderRepository: Repository<MedicationReminder>,
  ) {}

  async create(
    createMedicationReminderDto: CreateMedicationReminderDto,
    user: User,
  ) {
    try {
      const reminder = await this.medicationReminderRepository.find({
        where: {
          medication_brand_name: createMedicationReminderDto.medication_name,
          start_date: createMedicationReminderDto.start_date,
        },
      });

      if (!reminder) {
        throw new BadRequestException('You have a medication with the same');
      }

      if (
        moment(createMedicationReminderDto.start_date).isAfter(
          createMedicationReminderDto.end_date,
          'M',
        )
      ) {
        throw new BadRequestException(
          'Start Date should not be after the end date',
        );
      }

      const newMedicationReminder = new MedicationReminder();
      newMedicationReminder.condition = createMedicationReminderDto.condition;
      newMedicationReminder.dosage = createMedicationReminderDto.dosage;
      newMedicationReminder.frequency = createMedicationReminderDto.frequency;
      newMedicationReminder.medication_brand_name =
        createMedicationReminderDto.medication_name;
      newMedicationReminder.medication_strength =
        createMedicationReminderDto.medication_strength;
      newMedicationReminder.medication_type =
        createMedicationReminderDto.medication_type;
      newMedicationReminder.quantity =
        createMedicationReminderDto.medication_quantity;
      newMedicationReminder.duration = createMedicationReminderDto.duration;
      newMedicationReminder.specified_alarm_times =
        createMedicationReminderDto.specified_alarm_times;
      newMedicationReminder.user = user;
      newMedicationReminder.start_date = createMedicationReminderDto.start_date;
      newMedicationReminder.end_date = createMedicationReminderDto.end_date;

      await this.medicationReminderRepository.save(newMedicationReminder);

      return {
        message: 'Medication reminder added successfully',
        status: 'success',
        success: true,
      };
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'Something went wrong. Please try again later.',
      );
    }
  }

  async findAllUserMedicationReminder(id: string) {
    try {
      const reminders = await this.medicationReminderRepository.find({
        relations: { user: true },
        where: { user: { id } },
        order: { updated_at: 'DESC' },
      });

      return {
        message: 'User reminder fetched successfully',
        data: reminders,
        status: 'success',
        success: false,
      };
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'Something went wrong. Please try again later.',
      );
    }
  }

  async findAllUserMedicationReminderForToday(id: string) {
    try {
      // const reminders = await this.medicationReminderRepository.find({
      //   relations: { user: true },
      //   where: { user: { id }, start_date: },
      //   order: { updated_at: 'DESC' },
      // });

      const currentDate = moment().format('YYYY-MM-DD');

      const reminders = await this.medicationReminderRepository
        .createQueryBuilder('medication_reminder')
        .leftJoinAndSelect('medication_reminder.user', 'user')
        .where('user.id = :id', { id })
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere('medication_reminder.start_date <= :currentDate', {
              currentDate,
            }).andWhere(
              'medication_reminder.end_date != NULL AND medication_reminder.end_date >= :currentDate',
              {
                currentDate,
              },
            );
          }),
        )
        .getMany();

      console.log(reminders);

      return {
        message: 'User reminder fetched successfully',
        data: reminders,
        status: 'success',
        success: false,
      };
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'Something went wrong. Please try again later.',
      );
    }
  }

  async findOne(id: string) {
    try {
      const reminder = await this.medicationReminderRepository.findOne({
        where: { id },
      });

      return {
        message: 'User reminder fetched successfully',
        data: reminder,
        status: 'success',
        success: false,
      };
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'Something went wrong. Please try again later.',
      );
    }
  }

  async update(
    id: string,
    updateMedicationReminderDto: UpdateMedicationReminderDto,
  ) {
    console.log(updateMedicationReminderDto);
    try {
      const reminder = await this.medicationReminderRepository.findOne({
        where: {
          id,
        },
      });

      if (!reminder) {
        throw new BadRequestException('You have a medication with the same');
      }

      reminder.condition = updateMedicationReminderDto.condition;
      reminder.dosage = updateMedicationReminderDto.dosage;
      reminder.frequency = updateMedicationReminderDto.frequency;
      reminder.medication_brand_name =
        updateMedicationReminderDto.medication_name;
      reminder.medication_strength =
        updateMedicationReminderDto.medication_strength;
      reminder.medication_type = updateMedicationReminderDto.medication_type;
      reminder.quantity = updateMedicationReminderDto.medication_quantity;
      reminder.duration = updateMedicationReminderDto.duration;
      reminder.specified_alarm_times =
        updateMedicationReminderDto.specified_alarm_times;
      reminder.start_date = updateMedicationReminderDto.start_date;
      reminder.end_date = updateMedicationReminderDto.end_date;

      await this.medicationReminderRepository.save(reminder);

      return {
        message: 'Medication reminder added successfully',
        status: 'success',
        success: true,
      };
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'Something went wrong. Please try again later.',
      );
    }
  }

  async remove(id: string, userId: string) {
    try {
      const reminder = await this.medicationReminderRepository.findOne({
        where: { id, user: { id: userId } },
      });

      if (!reminder) {
        throw new BadRequestException('Reminder not found');
      }

      await this.medicationReminderRepository.softDelete(reminder.id);

      return {
        message: 'User reminder deleted successfully',
        status: 'success',
        success: false,
      };
    } catch (error) {
      if (error.status === 400) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'Something went wrong. Please try again later.',
      );
    }
  }
}
