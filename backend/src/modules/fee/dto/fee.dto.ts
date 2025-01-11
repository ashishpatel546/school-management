import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsDate, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FeeStatus } from '../../../entities/fee.entity';

export class CreateFeeDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  extraCurriculumFee?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({ enum: FeeStatus, default: FeeStatus.PENDING })
  @IsEnum(FeeStatus)
  @IsOptional()
  status?: FeeStatus;
}

export class UpdateFeeDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  extraCurriculumFee?: number;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ enum: FeeStatus, required: false })
  @IsEnum(FeeStatus)
  @IsOptional()
  status?: FeeStatus;
}

export class PayFeeDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
