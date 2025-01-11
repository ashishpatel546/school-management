import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsDate, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DisciplineType } from '../../../entities/behavior/discipline-record.entity';

export class CreateDisciplineRecordDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ enum: DisciplineType })
  @IsEnum(DisciplineType)
  @IsNotEmpty()
  type: DisciplineType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  points?: number;
}

export class ResolveDisciplineRecordDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isResolved: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  resolution: string;
}

export class UpdateDisciplineRecordDto {
  @ApiProperty({ required: false })
  @IsEnum(DisciplineType)
  @IsOptional()
  type?: DisciplineType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  points?: number;
}
