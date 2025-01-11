import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, IsUrl, IsUUID, Min, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MenuItemType } from '../../../entities/cafeteria/menu-item.entity';
import { OrderStatus } from '../../../entities/cafeteria/order.entity';

export class CreateMenuItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({ enum: MenuItemType })
  @IsEnum(MenuItemType)
  @IsNotEmpty()
  type: MenuItemType;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergens?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  nutritionalInfo?: string[];

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  menuItemId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  orderDate: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  specialInstructions?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  deliveryDate?: Date;
}

export class UpdateMenuItemDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ enum: MenuItemType, required: false })
  @IsEnum(MenuItemType)
  @IsOptional()
  type?: MenuItemType;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergens?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  nutritionalInfo?: string[];

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
