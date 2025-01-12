import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Resource } from '../../entities/resource-booking/resource.entity';
import { User } from '../../entities/user.entity';
import { ResourceBooking, BookingStatus } from '../../entities/resource-booking/resource-booking.entity';
import { CreateResourceDto, CreateBookingDto, UpdateResourceDto, UpdateBookingStatusDto } from './dto/resource-booking.dto';

@Injectable()
export class ResourceBookingService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(ResourceBooking)
    private bookingRepository: Repository<ResourceBooking>,
  ) {}

  async createResource(createDto: CreateResourceDto): Promise<Resource> {
    const resource = this.resourceRepository.create(createDto);
    return await this.resourceRepository.save(resource);
  }

  async findAllResources(): Promise<Resource[]> {
    return await this.resourceRepository.find();
  }

  async findResource(id: string): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({ where: { id } });
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
    return resource;
  }

  async updateResource(id: string, updateDto: UpdateResourceDto): Promise<Resource> {
    const resource = await this.findResource(id);
    Object.assign(resource, updateDto);
    return await this.resourceRepository.save(resource);
  }

  async removeResource(id: string): Promise<void> {
    const result = await this.resourceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
  }

  async createBooking(userId: string, createDto: CreateBookingDto): Promise<ResourceBooking> {
    const resource = await this.findResource(createDto.resourceId);
    
    // Check if resource is available for the requested time slot
    const conflictingBooking = await this.bookingRepository.findOne({
      where: {
        resource: { id: createDto.resourceId },
        status: BookingStatus.APPROVED,
        startTime: Raw((alias) => `${alias} < :endTime`, { endTime: createDto.endTime }),
        endTime: Raw((alias) => `${alias} > :startTime`, { startTime: createDto.startTime }),
      },
      relations: ['resource'],
    });

    if (conflictingBooking) {
      throw new BadRequestException('Resource is not available for the requested time slot');
    }

    const booking = this.bookingRepository.create({
      ...createDto,
      requestedBy: { id: userId } as User,
      resource,
      status: BookingStatus.PENDING,
    });

    return await this.bookingRepository.save(booking);
  }

  async findAllBookings(): Promise<ResourceBooking[]> {
    return await this.bookingRepository.find({
      relations: ['user', 'resource'],
    });
  }

  async findBooking(id: string): Promise<ResourceBooking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'resource'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async findUserBookings(userId: string): Promise<ResourceBooking[]> {
    return await this.bookingRepository.find({
      where: { requestedBy: { id: userId } },
      relations: ['resource'],
    });
  }

  async updateBookingStatus(id: string, updateDto: UpdateBookingStatusDto): Promise<ResourceBooking> {
    const booking = await this.findBooking(id);
    Object.assign(booking, updateDto);
    return await this.bookingRepository.save(booking);
  }
}
