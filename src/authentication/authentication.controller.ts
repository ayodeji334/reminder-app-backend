import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/create-authentication.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticiationService: AuthenticationService) {}

  @Post('login')
  create(@Body() createAuthenticiationDto: LoginDto) {
    return this.authenticiationService.create(createAuthenticiationDto);
  }
}
