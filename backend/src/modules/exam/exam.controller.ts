import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { CreateExamDto, UpdateExamDto } from './dto/exam.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Exams')
@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Create a new exam',
    description: 'Create a new exam with subject, class, and schedule information.'
  })
  @ApiResponse({ status: 201, description: 'Exam created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  @ApiResponse({ status: 404, description: 'Class or subject not found' })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examService.create(createExamDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all exams',
    description: 'Retrieve a list of all scheduled exams with their associated classes and subjects.'
  })
  @ApiResponse({ status: 200, description: 'List of all exams' })
  findAll() {
    return this.examService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get an exam by id',
    description: 'Retrieve detailed information about a specific exam.'
  })
  @ApiParam({ name: 'id', description: 'Exam ID' })
  @ApiResponse({ status: 200, description: 'Exam found' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  findOne(@Param('id') id: string) {
    return this.examService.findOne(id);
  }

  @Get('class/:classId')
  @ApiOperation({ 
    summary: 'Get all exams for a class',
    description: 'Retrieve all scheduled exams for a specific class.'
  })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiResponse({ status: 200, description: 'List of exams for the class' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  findByClass(@Param('classId') classId: string) {
    return this.examService.findByClass(classId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Update an exam',
    description: 'Update exam details including date, subject, and description.'
  })
  @ApiParam({ name: 'id', description: 'Exam ID' })
  @ApiResponse({ status: 200, description: 'Exam updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(id, updateExamDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Delete an exam',
    description: 'Delete an exam schedule. Only available to administrators.'
  })
  @ApiParam({ name: 'id', description: 'Exam ID' })
  @ApiResponse({ status: 200, description: 'Exam deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  remove(@Param('id') id: string) {
    return this.examService.remove(id);
  }
}
