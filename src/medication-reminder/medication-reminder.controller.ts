import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MedicationReminderService } from './medication-reminder.service';
import { CreateMedicationReminderDto } from './dto/create-medication-reminder.dto';
import { UpdateMedicationReminderDto } from './dto/update-medication-reminder.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('medication-reminders')
export class MedicationReminderController {
  constructor(
    private readonly medicationReminderService: MedicationReminderService,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createMedicationReminderDto: CreateMedicationReminderDto,
    @Req() req: any,
  ) {
    return this.medicationReminderService.create(
      createMedicationReminderDto,
      req.user?.id,
    );
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) {
    return this.medicationReminderService.findAllUserMedicationReminder(
      req.user?.id,
    );
  }

  @Get('today-medication')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  findAllMedicationsForToday(@Req() req: any) {
    return this.medicationReminderService.findAllUserMedicationReminderForToday(
      req.user?.id,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicationReminderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicationReminderDto: UpdateMedicationReminderDto,
  ) {
    return this.medicationReminderService.update(
      id,
      updateMedicationReminderDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.medicationReminderService.remove(id, req.user?.id);
  }
}
