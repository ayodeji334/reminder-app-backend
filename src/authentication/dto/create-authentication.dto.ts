import {
  IsString,
  IsNotEmpty,
  IsDefined,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Password is invalid' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsDefined({ message: 'Password is required' })
  password: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsDefined({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Device push notification token contain invalid data' })
  @IsOptional({ message: 'Device push notification token is required' })
  device_id: string;
}
