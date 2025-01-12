import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CafeteriaService } from './cafeteria.service';
import { CreateMenuItemDto, CreateOrderDto, UpdateMenuItemDto, UpdateOrderStatusDto } from './dto/cafeteria.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';

@ApiTags('Cafeteria')
@Controller('cafeteria')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CafeteriaController {
  constructor(private readonly cafeteriaService: CafeteriaService) {}

  @Post('menu-items')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new menu item' })
  createMenuItem(@Body() createDto: CreateMenuItemDto) {
    return this.cafeteriaService.createMenuItem(createDto);
  }

  @Get('menu-items')
  @ApiOperation({ summary: 'Get all menu items' })
  findAllMenuItems() {
    return this.cafeteriaService.findAllMenuItems();
  }

  @Get('menu-items/:id')
  @ApiOperation({ summary: 'Get a menu item by id' })
  findMenuItem(@Param('id') id: string) {
    return this.cafeteriaService.findMenuItem(id);
  }

  @Patch('menu-items/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a menu item' })
  updateMenuItem(@Param('id') id: string, @Body() updateDto: UpdateMenuItemDto) {
    return this.cafeteriaService.updateMenuItem(id, updateDto);
  }

  @Delete('menu-items/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a menu item' })
  removeMenuItem(@Param('id') id: string) {
    return this.cafeteriaService.removeMenuItem(id);
  }

  @Post('orders')
  @ApiOperation({ summary: 'Create a new order' })
  createOrder(@User('id') userId: string, @Body() createDto: CreateOrderDto) {
    return this.cafeteriaService.createOrder(userId, createDto);
  }

  @Get('orders')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all orders' })
  findAllOrders() {
    return this.cafeteriaService.findAllOrders();
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get an order by id' })
  findOrder(@Param('id') id: string) {
    return this.cafeteriaService.findOrder(id);
  }

  @Get('orders/user/:userId')
  @ApiOperation({ summary: 'Get orders by user' })
  findUserOrders(@Param('userId') userId: string) {
    return this.cafeteriaService.findUserOrders(userId);
  }

  @Patch('orders/:id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update order status' })
  updateOrderStatus(@Param('id') id: string, @Body() updateDto: UpdateOrderStatusDto) {
    return this.cafeteriaService.updateOrderStatus(id, updateDto);
  }
}
