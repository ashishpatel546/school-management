import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, IsBoolean, IsDate, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ClubCategory } from '../../../entities/clubs/club.entity';
import { EventStatus } from '../../../entities/clubs/club-event.entity';

export class CreateClubDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ClubCategory })
  @IsEnum(ClubCategory)
  @IsNotEmpty()
  category: ClubCategory;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  supervisorId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  meetingSchedule?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxMembers?: number;
}

export class CreateClubEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  clubId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  resources?: string[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxParticipants?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  requiresRegistration?: boolean;
}

export class UpdateClubDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ClubCategory, required: false })
  @IsEnum(ClubCategory)
  @IsOptional()
  category?: ClubCategory;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  meetingSchedule?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requirements?: string[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxMembers?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateClubEventDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ enum: EventStatus, required: false })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  resources?: string[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxParticipants?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  requiresRegistration?: boolean;
}
