import { IsString, IsNotEmpty, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PromoteStudentsDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  fromClassId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  toClassId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  studentIds: string[];
}

export class UpdateRollNumberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rollNumber: string;
}
