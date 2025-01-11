import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CreateEventDto, UpdateEventDto } from './dto/calendar.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';

@ApiTags('Calendar')
@Controller('calendar')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('events')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new event' })
  create(@User('id') userId: string, @Body() createEventDto: CreateEventDto) {
    return this.calendarService.create(userId, createEventDto);
  }

  @Get('events')
  @ApiOperation({ summary: 'Get all events' })
  findAll() {
    return this.calendarService.findAll();
  }

  @Get('events/upcoming')
  @ApiOperation({ summary: 'Get upcoming events' })
  findUpcoming() {
    return this.calendarService.findUpcoming();
  }

  @Get('events/range')
  @ApiOperation({ summary: 'Get events by date range' })
  findByDateRange(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.calendarService.findByDateRange(startDate, endDate);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get an event by id' })
  findOne(@Param('id') id: string) {
    return this.calendarService.findOne(id);
  }

  @Patch('events/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update an event' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.calendarService.update(id, updateEventDto);
  }

  @Delete('events/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an event' })
  remove(@Param('id') id: string) {
    return this.calendarService.remove(id);
  }
}
