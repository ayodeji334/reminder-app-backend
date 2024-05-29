import { IsString, IsNotEmpty, IsDefined, IsEmail } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Password is invalid' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsDefined({ message: 'Password is required' })
  password: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsDefined({ message: 'Email is required' })
  email: string;
}
