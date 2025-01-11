import { Controller, Get, Post, Body, Patch, Param, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ExamResultService } from './exam-result.service';
import { PdfService } from '../pdf/pdf.service';
import { CreateExamResultDto, UpdateExamResultDto, PublishResultsDto } from './dto/exam-result.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Exam Results')
@Controller('exam-results')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExamResultController {
  constructor(
    private readonly examResultService: ExamResultService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new exam result' })
  create(@Body() createExamResultDto: CreateExamResultDto) {
    return this.examResultService.create(createExamResultDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all exam results' })
  findAll() {
    return this.examResultService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exam result by id' })
  findOne(@Param('id') id: string) {
    return this.examResultService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Update an exam result' })
  update(@Param('id') id: string, @Body() updateExamResultDto: UpdateExamResultDto) {
    return this.examResultService.update(id, updateExamResultDto);
  }

  @Get('exam/:examId')
  @Roles(UserRole.TEACHER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all results for an exam' })
  findByExam(@Param('examId') examId: string) {
    return this.examResultService.findByExam(examId);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get all results for a student' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.examResultService.findByStudent(studentId);
  }

  @Post('publish')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish results for an exam' })
  publishResults(@Body() publishResultsDto: PublishResultsDto) {
    return this.examResultService.publishResults(publishResultsDto.examId);
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Download exam result' })
  async downloadResult(@Param('id') id: string, @Res() res: Response) {
    const result = await this.examResultService.findOne(id);
    const pdfBuffer = await this.pdfService.generateExamResult(result);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=result-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }
}
