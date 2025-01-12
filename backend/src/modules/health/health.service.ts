import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { HealthRecord } from '../../entities/health/health-record.entity';
import { User } from '../../entities/user.entity';
import { CreateHealthRecordDto, UpdateHealthRecordDto } from './dto/health.dto';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(HealthRecord)
    private healthRepository: Repository<HealthRecord>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(attendedById: string, createDto: CreateHealthRecordDto): Promise<HealthRecord> {
    const student = await this.userRepository.findOne({
      where: { id: createDto.studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${createDto.studentId} not found`);
    }

    const attendedBy = await this.userRepository.findOne({
      where: { id: attendedById },
    });
    if (!attendedBy) {
      throw new NotFoundException(`Staff with ID ${attendedById} not found`);
    }

    const record = this.healthRepository.create({
      ...createDto,
      student,
      attendedBy,
    });

    return await this.healthRepository.save(record);
  }

  async findAll(): Promise<HealthRecord[]> {
    return await this.healthRepository.find({
      relations: ['student', 'attendedBy'],
      order: { visitDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<HealthRecord> {
    const record = await this.healthRepository.findOne({
      where: { id },
      relations: ['student', 'attendedBy'],
    });
    if (!record) {
      throw new NotFoundException(`Health record with ID ${id} not found`);
    }
    return record;
  }

  async findByStudent(studentId: string): Promise<HealthRecord[]> {
    return await this.healthRepository.find({
      where: { student: { id: studentId } },
      relations: ['student', 'attendedBy'],
      order: { visitDate: 'DESC' },
    });
  }

  async update(id: string, updateDto: UpdateHealthRecordDto): Promise<HealthRecord> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return await this.healthRepository.save(record);
  }

  async findFollowUps(): Promise<HealthRecord[]> {
    return await this.healthRepository.find({
      where: { followUpRequired: true },
      relations: ['student', 'attendedBy'],
      order: { followUpDate: 'ASC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<HealthRecord[]> {
    return await this.healthRepository.find({
      where: {
        visitDate: Raw((alias) => `${alias} BETWEEN :start AND :end`, { start: startDate, end: endDate }),
      },
      relations: ['student', 'attendedBy'],
      order: { visitDate: 'DESC' },
    });
  }
}
