import { IsString, IsNumber, IsNotEmpty, IsOptional, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamResultDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  examId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  marksObtained: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  totalMarks: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  teacherComments?: string;
}

export class UpdateExamResultDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  marksObtained?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  totalMarks?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  teacherComments?: string;
}

export class PublishResultsDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  examId: string;
}
