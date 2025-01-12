import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Event } from '../../entities/calendar/event.entity';
import { User } from '../../entities/user.entity';
import { CreateEventDto, UpdateEventDto } from './dto/calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: string, createEventDto: CreateEventDto): Promise<Event> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const event = this.eventRepository.create({
      ...createEventDto,
      createdBy: user,
    });

    return await this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find({
      relations: ['createdBy'],
      where: { isActive: true },
      order: { startDate: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return await this.eventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    event.isActive = false;
    await this.eventRepository.save(event);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return await this.eventRepository.find({
      where: {
        startDate: Between(startDate, endDate),
        isActive: true,
      },
      relations: ['createdBy'],
      order: { startDate: 'ASC' },
    });
  }

  async findUpcoming(): Promise<Event[]> {
    const now = new Date();
    return await this.eventRepository.find({
      where: {
        startDate: Between(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)), // Next 30 days
        isActive: true,
      },
      relations: ['createdBy'],
      order: { startDate: 'ASC' },
    });
  }
}
