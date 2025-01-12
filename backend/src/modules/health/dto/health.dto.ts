import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsDate, IsArray, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VisitType } from '../../../entities/health/health-record.entity';

export class CreateHealthRecordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ enum: VisitType })
  @IsEnum(VisitType)
  @IsNotEmpty()
  visitType: VisitType;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  visitDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  symptoms: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  treatment?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  prescription?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  followUpRequired?: boolean;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  followUpDate?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isEmergencyContact?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @ApiProperty({ required: false })
  @IsPhoneNumber()
  @IsOptional()
  emergencyContactNumber?: string;
}

export class UpdateHealthRecordDto {
  @ApiProperty({ enum: VisitType, required: false })
  @IsEnum(VisitType)
  @IsOptional()
  visitType?: VisitType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  treatment?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  prescription?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  followUpRequired?: boolean;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  followUpDate?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
