import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID, IsDate, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAssignmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dueDate: Date;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalMarks?: number;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  attachmentUrl?: string;
}

export class CreateSubmissionDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  assignmentId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  attachmentUrl?: string;
}

export class GradeSubmissionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  marks: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  teacherFeedback?: string;
}
