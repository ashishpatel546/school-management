import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bus } from '../../entities/transportation/bus.entity';
import { BusStop } from '../../entities/transportation/bus-stop.entity';
import { BusRoute } from '../../entities/transportation/bus-route.entity';
import { BusLocation } from '../../entities/transportation/bus-location.entity';
import { User } from '../../entities/user.entity';
import { CreateBusDto, CreateBusRouteDto, UpdateBusLocationDto } from './dto/transportation.dto';

@Injectable()
export class TransportationService {
  constructor(
    @InjectRepository(Bus)
    private busRepository: Repository<Bus>,
    @InjectRepository(BusStop)
    private busStopRepository: Repository<BusStop>,
    @InjectRepository(BusRoute)
    private busRouteRepository: Repository<BusRoute>,
    @InjectRepository(BusLocation)
    private busLocationRepository: Repository<BusLocation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createBus(createDto: CreateBusDto): Promise<Bus> {
    const bus = this.busRepository.create({
      number: createDto.number,
      capacity: createDto.capacity,
      driverName: createDto.driverName,
      driverContact: createDto.driverContact,
    });

    return await this.busRepository.save(bus);
  }

  async findAllBuses(): Promise<Bus[]> {
    return await this.busRepository.find({
      relations: ['driver', 'route', 'currentLocation'],
    });
  }

  async findBus(id: string): Promise<Bus> {
    const bus = await this.busRepository.findOne({
      where: { id },
      relations: ['driver', 'route', 'currentLocation'],
    });
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }
    return bus;
  }

  async updateBus(id: string, updateDto: Partial<CreateBusDto>): Promise<Bus> {
    const bus = await this.findBus(id);
    Object.assign(bus, updateDto);
    return await this.busRepository.save(bus);
  }

  async createRoute(createDto: CreateBusRouteDto): Promise<BusRoute> {
    const bus = await this.busRepository.findOne({
      where: { id: createDto.busId },
    });
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${createDto.busId} not found`);
    }

    const route = this.busRouteRepository.create({
      name: createDto.name,
      startTime: createDto.startTime,
      endTime: createDto.endTime,
      bus,
    });
    return await this.busRouteRepository.save(route);
  }

  async findAllRoutes(): Promise<BusRoute[]> {
    return await this.busRouteRepository.find({
      relations: ['stops', 'buses'],
    });
  }

  async updateLocation(busId: string, updateDto: UpdateBusLocationDto): Promise<BusLocation> {
    const bus = await this.findBus(busId);
    const location = this.busLocationRepository.create({
      ...updateDto,
      bus,
    });
    return await this.busLocationRepository.save(location);
  }

  async getLatestLocation(busId: string): Promise<BusLocation> {
    const location = await this.busLocationRepository.findOne({
      where: { bus: { id: busId } },
      order: { timestamp: 'DESC' },
    });
    if (!location) {
      throw new NotFoundException(`No location found for bus with ID ${busId}`);
    }
    return location;
  }
}
