import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoginDto } from './dto/create-authentication.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: loginDto.email,
        },
      });

      if (user) {
        const { password, fullname, email, ...rest } = user;

        const isPasswordMatched =
          loginDto.password.toLowerCase() === password.toLowerCase();

        if (isPasswordMatched) {
          const token = await this.jwtService.signAsync(
            {
              user: {
                fullname,
                email,
              },
              sub: user.id,
            },
            {
              expiresIn: '5m',
              secret: this.configService.get<string>('SECRET'),
            },
          );

          return {
            message: 'Login successfully',
            status: 'success',
            success: true,
            data: {
              access_token: token,
              user: {
                ...rest,
                fullname,
                email,
              },
            },
          };
        }
      }

      throw new BadRequestException('Invalid username or password');
    } catch (error: any) {
      console.log(error);
      if (error.status === 400) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'Something went wrong. Try again in 5 minutes',
      );
    }
  }
}
