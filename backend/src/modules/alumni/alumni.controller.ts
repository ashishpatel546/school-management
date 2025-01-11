import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlumniService } from './alumni.service';
import { CreateAlumniDto, UpdateAlumniDto } from './dto/alumni.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Alumni')
@Controller('alumni')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AlumniController {
  constructor(private readonly alumniService: AlumniService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new alumni record' })
  create(@Body() createAlumniDto: CreateAlumniDto) {
    return this.alumniService.create(createAlumniDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all alumni records' })
  findAll() {
    return this.alumniService.findAll();
  }

  @Get('year/:year')
  @ApiOperation({ summary: 'Get alumni by graduation year' })
  findByYear(@Param('year') year: number) {
    return this.alumniService.findByGraduationYear(year);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get alumni by employment status' })
  findByStatus(@Param('status') status: string) {
    return this.alumniService.findByEmploymentStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an alumni record by id' })
  findOne(@Param('id') id: string) {
    return this.alumniService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an alumni record' })
  update(@Param('id') id: string, @Body() updateAlumniDto: UpdateAlumniDto) {
    return this.alumniService.update(id, updateAlumniDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an alumni record' })
  remove(@Param('id') id: string) {
    return this.alumniService.remove(id);
  }
}
