import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto, BulkCreateAttendanceDto } from './dto/attendance.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'Mark attendance for a student',
    description: 'Teachers can mark attendance for individual students in their class.'
  })
  @ApiResponse({ status: 201, description: 'Attendance marked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only teachers can mark attendance' })
  @ApiResponse({ status: 404, description: 'Student or class not found' })
  create(@Body() createAttendanceDto: CreateAttendanceDto, @User('id') teacherId: string) {
    return this.attendanceService.create(createAttendanceDto, teacherId);
  }

  @Post('bulk')
  @Roles(UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'Mark attendance for multiple students',
    description: 'Teachers can mark attendance for multiple students in a class at once.'
  })
  @ApiResponse({ status: 201, description: 'Bulk attendance marked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only teachers can mark attendance' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  bulkCreate(@Body() bulkCreateDto: BulkCreateAttendanceDto, @User('id') teacherId: string) {
    return this.attendanceService.bulkCreate(bulkCreateDto, teacherId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'Get all attendance records',
    description: 'Retrieve all attendance records. Available to administrators and teachers.'
  })
  @ApiResponse({ status: 200, description: 'List of all attendance records' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient privileges' })
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get attendance by id',
    description: 'Retrieve a specific attendance record by its ID.'
  })
  @ApiParam({ name: 'id', description: 'Attendance record ID' })
  @ApiResponse({ status: 200, description: 'Attendance record found' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Get('class/:classId')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'Get attendance by class',
    description: 'Retrieve attendance records for a specific class on a given date.'
  })
  @ApiParam({ name: 'classId', description: 'Class ID' })
  @ApiQuery({ name: 'date', description: 'Date to fetch attendance for', required: true })
  @ApiResponse({ status: 200, description: 'List of attendance records for the class' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient privileges' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  findByClass(@Param('classId') classId: string, @Query('date') date: Date) {
    return this.attendanceService.findByClass(classId, date);
  }

  @Get('student/:studentId')
  @ApiOperation({ 
    summary: 'Get attendance by student',
    description: 'Retrieve all attendance records for a specific student.'
  })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'List of student attendance records' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.attendanceService.findByStudent(studentId);
  }

  @Patch(':id')
  @Roles(UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'Update attendance',
    description: 'Update an existing attendance record. Only available to teachers.'
  })
  @ApiParam({ name: 'id', description: 'Attendance record ID' })
  @ApiResponse({ status: 200, description: 'Attendance record updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only teachers can update attendance' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }
}
