import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GenderTypes } from 'src/common/constraints/types';

export class CreateUserDto {
  @IsEmail(
    {
      blacklisted_chars: '@_#*)($',
      host_blacklist: ['gmail'],
      domain_specific_validation: true,
      allow_ip_domain: true,
      require_tld: true,
    },
    { message: 'Email is invalid' },
  )
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsDefined({ message: 'Email is required' })
  email: string;

  @IsEnum(GenderTypes, { message: 'Gender contain invalid data' })
  @IsNotEmpty({ message: 'Gender should not be empty' })
  @IsDefined({ message: 'Gender is required' })
  gender: GenderTypes;

  @IsString({ message: 'Full Name contain invalid data' })
  @IsNotEmpty({ message: 'Full Name should not be empty' })
  @IsDefined({ message: 'Full Name is required' })
  username: string;

  @IsString({ message: 'Full Name contain invalid data' })
  @IsNotEmpty({ message: 'Full Name should not be empty' })
  @IsDefined({ message: 'Full Name is required' })
  password: string;

  @IsString({ message: 'Diagnosis Disease contain invalid data' })
  @IsNotEmpty({ message: 'Diagnosis Disease should not be empty' })
  @IsDefined({ message: 'Diagnosis Disease is required' })
  diagonsis_disease: string;

  @IsString({ message: 'Age contain invalid data' })
  @IsNotEmpty({ message: 'Age should not be empty' })
  @IsDefined({ message: 'Age is required' })
  age: string;

  @IsString({ message: 'Device push notification token contain invalid data' })
  @IsOptional({ message: 'Device push notification token is required' })
  device_id: string;
}
