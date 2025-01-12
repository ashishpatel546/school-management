import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsUUID, IsLatitude, IsLongitude, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  driverContact?: string;
}

export class CreateBusRouteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  busId: string;
}

export class CreateBusStopDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  estimatedTime: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  routeId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  sequence: number;
}

export class UpdateBusLocationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  busId: string;

  @ApiProperty()
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  timestamp: Date;
}
