import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HomeworkService } from './homework.service';
import { CreateAssignmentDto, CreateSubmissionDto, GradeSubmissionDto } from './dto/homework.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';

@ApiTags('Homework')
@Controller('homework')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post('assignments')
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new assignment' })
  createAssignment(
    @User('id') teacherId: string,
    @Body() createDto: CreateAssignmentDto,
  ) {
    return this.homeworkService.createAssignment(teacherId, createDto);
  }

  @Get('assignments')
  @ApiOperation({ summary: 'Get all assignments' })
  findAllAssignments() {
    return this.homeworkService.findAllAssignments();
  }

  @Get('assignments/class/:classId')
  @ApiOperation({ summary: 'Get assignments by class' })
  findAssignmentsByClass(@Param('classId') classId: string) {
    return this.homeworkService.findAssignmentsByClass(classId);
  }

  @Get('assignments/student')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get assignments for current student' })
  findMyAssignments(@User('id') studentId: string) {
    return this.homeworkService.findAssignmentsByStudent(studentId);
  }

  @Post('submissions')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Submit an assignment' })
  createSubmission(
    @User('id') studentId: string,
    @Body() createDto: CreateSubmissionDto,
  ) {
    return this.homeworkService.createSubmission(studentId, createDto);
  }

  @Patch('submissions/:id/grade')
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Grade a submission' })
  gradeSubmission(
    @Param('id') id: string,
    @Body() gradeDto: GradeSubmissionDto,
  ) {
    return this.homeworkService.gradeSubmission(id, gradeDto);
  }

  @Get('submissions/assignment/:assignmentId')
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Get submissions for an assignment' })
  findSubmissionsByAssignment(@Param('assignmentId') assignmentId: string) {
    return this.homeworkService.findSubmissionsByAssignment(assignmentId);
  }

  @Get('submissions/student')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get submissions for current student' })
  findMySubmissions(@User('id') studentId: string) {
    return this.homeworkService.findSubmissionsByStudent(studentId);
  }
}
