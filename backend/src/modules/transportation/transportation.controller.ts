import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransportationService } from './transportation.service';
import { CreateBusDto, CreateBusRouteDto, UpdateBusLocationDto } from './dto/transportation.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Transportation')
@Controller('transportation')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TransportationController {
  constructor(private readonly transportationService: TransportationService) {}

  @Post('buses')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new bus' })
  createBus(@Body() createDto: CreateBusDto) {
    return this.transportationService.createBus(createDto);
  }

  @Get('buses')
  @ApiOperation({ summary: 'Get all buses' })
  findAllBuses() {
    return this.transportationService.findAllBuses();
  }

  @Get('buses/:id')
  @ApiOperation({ summary: 'Get a bus by id' })
  findBus(@Param('id') id: string) {
    return this.transportationService.findBus(id);
  }

  @Patch('buses/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a bus' })
  updateBus(@Param('id') id: string, @Body() updateDto: Partial<CreateBusDto>) {
    return this.transportationService.updateBus(id, updateDto);
  }

  @Post('routes')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new route' })
  createRoute(@Body() createDto: CreateBusRouteDto) {
    return this.transportationService.createRoute(createDto);
  }

  @Get('routes')
  @ApiOperation({ summary: 'Get all routes' })
  findAllRoutes() {
    return this.transportationService.findAllRoutes();
  }

  @Post('buses/:id/location')
  @ApiOperation({ summary: 'Update bus location' })
  updateLocation(
    @Param('id') id: string,
    @Body() updateDto: UpdateBusLocationDto,
  ) {
    return this.transportationService.updateLocation(id, updateDto);
  }

  @Get('buses/:id/location')
  @ApiOperation({ summary: 'Get latest bus location' })
  getLatestLocation(@Param('id') id: string) {
    return this.transportationService.getLatestLocation(id);
  }
}
