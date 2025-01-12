import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { CreateHealthRecordDto, UpdateHealthRecordDto } from './dto/health.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';

@ApiTags('Health')
@Controller('health')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a health record' })
  create(@Body() createDto: CreateHealthRecordDto, @User('id') attendedById: string) {
    return this.healthService.create(attendedById, createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get all health records' })
  findAll() {
    return this.healthService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a health record by id' })
  findOne(@Param('id') id: string) {
    return this.healthService.findOne(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get health records by student' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.healthService.findByStudent(studentId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update a health record' })
  update(@Param('id') id: string, @Body() updateDto: UpdateHealthRecordDto) {
    return this.healthService.update(id, updateDto);
  }
}
