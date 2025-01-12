import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID, IsDate, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  copiesAvailable?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  publisher?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  publishedYear?: number;
}

export class CreateBookLoanDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dueDate: Date;
}

export class UpdateBookLoanDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  condition?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isReturned?: boolean;
}
