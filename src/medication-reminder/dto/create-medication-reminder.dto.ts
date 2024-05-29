import {
  IsString,
  IsNotEmpty,
  IsDefined,
  IsNumber,
  IsISO8601,
} from 'class-validator';

export class CreateMedicationReminderDto {
  @IsString({ message: 'Duration is invalid' })
  @IsNotEmpty({ message: 'Duration should not be empty' })
  @IsDefined({ message: 'Duration is required' })
  duration: string;

  @IsString({ message: 'Medication Name is invalid' })
  @IsNotEmpty({ message: 'Medication Name should not be empty' })
  @IsDefined({ message: 'Medication Name is required' })
  medication_name: string;

  @IsISO8601({ strict: true }, { message: 'Start Date is invalid' })
  @IsNotEmpty({ message: 'Start Date should not be empty' })
  @IsDefined({ message: 'Start Date is required' })
  start_date: string;

  @IsISO8601({ strict: true }, { message: 'End Date is invalid' })
  @IsNotEmpty({ message: 'End Date should not be empty' })
  @IsDefined({ message: 'End Date is required' })
  end_date: string;

  @IsString({ message: 'Medication Type is invalid' })
  @IsNotEmpty({ message: 'Medication Type should not be empty' })
  @IsDefined({ message: 'Medication Type is required' })
  medication_type: string;

  @IsString({ message: 'Frequency is invalid' })
  @IsNotEmpty({ message: 'Frequency should not be empty' })
  @IsDefined({ message: 'Frequency is required' })
  frequency: string;

  @IsString({ message: 'Condition is invalid' })
  @IsNotEmpty({ message: 'Condition should not be empty' })
  @IsDefined({ message: 'Condition is required' })
  condition: string;

  @IsString({ message: 'Medication Quantity is invalid' })
  @IsNotEmpty({ message: 'Medication Quantity should not be empty' })
  @IsDefined({ message: 'Medication Quantity is required' })
  medication_quantity: string;

  @IsString({ message: 'Medication Strength is invalid' })
  @IsNotEmpty({ message: 'Medication Strength should not be empty' })
  @IsDefined({ message: 'Medication Strength is required' })
  medication_strength: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Dosage is invalid' },
  )
  @IsNotEmpty({ message: 'Dosage should not be empty' })
  @IsDefined({ message: 'Dosage is required' })
  dosage: number;

  @IsString({ each: true, message: 'Reminder Times is invalid' })
  @IsNotEmpty({ message: 'Reminder Times should not be empty' })
  @IsDefined({ message: 'Reminder Times is required' })
  specified_alarm_times: string[];
}
