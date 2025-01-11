import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ClassService } from './class.service';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Create a new class',
    description: 'Create a new class with grade, section, and base fee information.'
  })
  @ApiResponse({ status: 201, description: 'Class created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all classes',
    description: 'Retrieve a list of all classes with their associated teachers and students.'
  })
  @ApiResponse({ status: 200, description: 'List of all classes' })
  findAll() {
    return this.classService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a class by id',
    description: 'Retrieve detailed information about a specific class.'
  })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class found' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  findOne(@Param('id') id: string) {
    return this.classService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Update a class',
    description: 'Update class details including name, grade, section, and base fee.'
  })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(id, updateClassDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Delete a class',
    description: 'Delete a class and its associations. Only available to super administrators.'
  })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'Class deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires super admin privileges' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }

  @Post(':classId/teachers/:teacherId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Assign a teacher to a class',
    description: 'Associate a teacher with a specific class for teaching responsibilities.'
  })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiParam({ name: 'teacherId', description: 'Teacher ID' })
  @ApiResponse({ status: 200, description: 'Teacher assigned successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  @ApiResponse({ status: 404, description: 'Class or teacher not found' })
  assignTeacher(
    @Param('classId') classId: string,
    @Param('teacherId') teacherId: string,
  ) {
    return this.classService.assignTeacher(classId, teacherId);
  }

  @Post(':classId/students/:studentId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Assign a student to a class' })
  assignStudent(
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classService.assignStudent(classId, studentId);
  }
}
