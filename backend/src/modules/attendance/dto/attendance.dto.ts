import { IsString, IsNotEmpty, IsBoolean, IsDate, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  present: boolean;
}

export class UpdateAttendanceDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  present: boolean;
}

export class BulkCreateAttendanceDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ type: [String] })
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  presentStudentIds: string[];
}
