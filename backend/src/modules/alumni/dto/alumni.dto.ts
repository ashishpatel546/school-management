import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsUrl, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EmploymentStatus } from '../../../entities/alumni/alumni.entity';

export class CreateAlumniDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  graduationYear: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  college?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  degree?: string;

  @ApiProperty({ enum: EmploymentStatus })
  @IsEnum(EmploymentStatus)
  @IsNotEmpty()
  employmentStatus: EmploymentStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  achievements?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  linkedinProfile?: string;
}

export class UpdateAlumniDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  college?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  degree?: string;

  @ApiProperty({ enum: EmploymentStatus, required: false })
  @IsEnum(EmploymentStatus)
  @IsOptional()
  employmentStatus?: EmploymentStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  achievements?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  linkedinProfile?: string;
}
