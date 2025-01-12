import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../../entities/cafeteria/menu-item.entity';
import { CafeteriaOrder, OrderStatus } from '../../entities/cafeteria/order.entity';
import { CreateMenuItemDto, CreateOrderDto, UpdateMenuItemDto, UpdateOrderStatusDto } from './dto/cafeteria.dto';

@Injectable()
export class CafeteriaService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
    @InjectRepository(CafeteriaOrder)
    private orderRepository: Repository<CafeteriaOrder>,
  ) {}

  async createMenuItem(createDto: CreateMenuItemDto): Promise<MenuItem> {
    const menuItem = this.menuItemRepository.create(createDto);
    return await this.menuItemRepository.save(menuItem);
  }

  async findAllMenuItems(): Promise<MenuItem[]> {
    return await this.menuItemRepository.find();
  }

  async findMenuItem(id: string): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findOne({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return menuItem;
  }

  async updateMenuItem(id: string, updateDto: UpdateMenuItemDto): Promise<MenuItem> {
    const menuItem = await this.findMenuItem(id);
    Object.assign(menuItem, updateDto);
    return await this.menuItemRepository.save(menuItem);
  }

  async removeMenuItem(id: string): Promise<void> {
    const result = await this.menuItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
  }

  async createOrder(userId: string, createDto: CreateOrderDto): Promise<CafeteriaOrder> {
    const menuItem = await this.findMenuItem(createDto.menuItemId);
    const order = this.orderRepository.create({
      student: { id: userId },
      menuItem,
      quantity: createDto.quantity,
      totalAmount: menuItem.price * createDto.quantity,
      orderDate: new Date(),
      status: OrderStatus.PENDING,
      specialInstructions: createDto.specialInstructions,
      deliveryDate: null
    });
    return await this.orderRepository.save(order);
  }

  async findAllOrders(): Promise<CafeteriaOrder[]> {
    return await this.orderRepository.find({
      relations: ['student', 'menuItem'],
    });
  }

  async findOrder(id: string): Promise<CafeteriaOrder> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['student', 'menuItem'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findUserOrders(userId: string): Promise<CafeteriaOrder[]> {
    return await this.orderRepository.find({
      where: { student: { id: userId } },
      relations: ['menuItem'],
    });
  }

  async updateOrderStatus(id: string, updateDto: UpdateOrderStatusDto): Promise<CafeteriaOrder> {
    const order = await this.findOrder(id);
    Object.assign(order, updateDto);
    return await this.orderRepository.save(order);
  }
}
