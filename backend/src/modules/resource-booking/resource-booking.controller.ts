import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ResourceBookingService } from './resource-booking.service';
import { CreateResourceDto, CreateBookingDto, UpdateResourceDto, UpdateBookingStatusDto } from './dto/resource-booking.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';

@ApiTags('Resource Booking')
@Controller('resource-booking')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ResourceBookingController {
  constructor(private readonly resourceBookingService: ResourceBookingService) {}

  @Post('resources')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new resource' })
  createResource(@Body() createDto: CreateResourceDto) {
    return this.resourceBookingService.createResource(createDto);
  }

  @Get('resources')
  @ApiOperation({ summary: 'Get all resources' })
  findAllResources() {
    return this.resourceBookingService.findAllResources();
  }

  @Get('resources/:id')
  @ApiOperation({ summary: 'Get a resource by id' })
  findResource(@Param('id') id: string) {
    return this.resourceBookingService.findResource(id);
  }

  @Patch('resources/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a resource' })
  updateResource(@Param('id') id: string, @Body() updateDto: UpdateResourceDto) {
    return this.resourceBookingService.updateResource(id, updateDto);
  }

  @Delete('resources/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a resource' })
  removeResource(@Param('id') id: string) {
    return this.resourceBookingService.removeResource(id);
  }

  @Post('bookings')
  @ApiOperation({ summary: 'Create a new booking' })
  createBooking(@User('id') userId: string, @Body() createDto: CreateBookingDto) {
    return this.resourceBookingService.createBooking(userId, createDto);
  }

  @Get('bookings')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all bookings' })
  findAllBookings() {
    return this.resourceBookingService.findAllBookings();
  }

  @Get('bookings/:id')
  @ApiOperation({ summary: 'Get a booking by id' })
  findBooking(@Param('id') id: string) {
    return this.resourceBookingService.findBooking(id);
  }

  @Get('bookings/user/:userId')
  @ApiOperation({ summary: 'Get bookings by user' })
  findUserBookings(@Param('userId') userId: string) {
    return this.resourceBookingService.findUserBookings(userId);
  }

  @Patch('bookings/:id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update booking status' })
  updateBookingStatus(@Param('id') id: string, @Body() updateDto: UpdateBookingStatusDto) {
    return this.resourceBookingService.updateBookingStatus(id, updateDto);
  }
}
