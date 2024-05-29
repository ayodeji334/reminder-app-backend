import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      console.log(createUserDto);

      if (existingUser) {
        throw new BadRequestException('The email already used by another user');
      }

      const newUser = new User();
      newUser.gender = createUserDto.gender;
      newUser.age = createUserDto.age;
      newUser.diagnosis_disease = createUserDto.diagonsis_disease;
      newUser.email = createUserDto.email;
      newUser.fullname = createUserDto.username;
      newUser.device_id = createUserDto.device_id;
      newUser.password = createUserDto.password;

      const { fullname, email, id, ...rest } =
        await this.userRepository.save(newUser);

      const token = await this.jwtService.signAsync(
        {
          user: {
            fullname,
            email,
          },
          sub: id,
        },
        { expiresIn: '5m', secret: this.configService.get<string>('SECRET') },
      );

      return {
        message: 'Account created successfully',
        status: 'success',
        success: true,
        data: {
          access_token: token,
          user: {
            ...rest,
            fullname,
            email,
            id,
          },
        },
      };
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'Something went wrong. Try again in 5 minutes',
      );
    }
  }

  findAll() {
    return 'This action returns all users';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
