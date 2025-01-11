import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ExtraCurriculumService } from './extra-curriculum.service';
import { CreateExtraCurriculumDto, UpdateExtraCurriculumDto } from './dto/extra-curriculum.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Extra Curriculum')
@Controller('extra-curriculum')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExtraCurriculumController {
  constructor(private readonly extraCurriculumService: ExtraCurriculumService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Create a new extra curriculum activity',
    description: 'Create a new extra curriculum activity with name, fee, and description.'
  })
  @ApiResponse({ status: 201, description: 'Extra curriculum activity created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  create(@Body() createDto: CreateExtraCurriculumDto) {
    return this.extraCurriculumService.create(createDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all extra curriculum activities',
    description: 'Retrieve a list of all available extra curriculum activities with their fees.'
  })
  @ApiResponse({ status: 200, description: 'List of all extra curriculum activities' })
  findAll() {
    return this.extraCurriculumService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get an extra curriculum activity by id',
    description: 'Retrieve detailed information about a specific extra curriculum activity.'
  })
  @ApiParam({ name: 'id', description: 'Extra curriculum activity ID' })
  @ApiResponse({ status: 200, description: 'Extra curriculum activity found' })
  @ApiResponse({ status: 404, description: 'Extra curriculum activity not found' })
  findOne(@Param('id') id: string) {
    return this.extraCurriculumService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Update an extra curriculum activity',
    description: 'Update extra curriculum activity details including name, fee, and description.'
  })
  @ApiParam({ name: 'id', description: 'Extra curriculum activity ID' })
  @ApiResponse({ status: 200, description: 'Extra curriculum activity updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  @ApiResponse({ status: 404, description: 'Extra curriculum activity not found' })
  update(@Param('id') id: string, @Body() updateDto: UpdateExtraCurriculumDto) {
    return this.extraCurriculumService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Delete an extra curriculum activity',
    description: 'Delete an extra curriculum activity. Only available to super administrators.'
  })
  @ApiParam({ name: 'id', description: 'Extra curriculum activity ID' })
  @ApiResponse({ status: 200, description: 'Extra curriculum activity deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires super admin privileges' })
  @ApiResponse({ status: 404, description: 'Extra curriculum activity not found' })
  remove(@Param('id') id: string) {
    return this.extraCurriculumService.remove(id);
  }

  @Post(':id/students/:studentId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Assign a student to an extra curriculum activity',
    description: 'Enroll a student in an extra curriculum activity. This will affect their total fee.'
  })
  @ApiParam({ name: 'id', description: 'Extra curriculum activity ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student enrolled successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  @ApiResponse({ status: 404, description: 'Extra curriculum activity or student not found' })
  assignStudent(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ) {
    return this.extraCurriculumService.assignStudent(id, studentId);
  }
}
