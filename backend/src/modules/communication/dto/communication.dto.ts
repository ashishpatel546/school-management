import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  subject?: string;
}

export class UpdateMessageDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isRead: boolean;
}
