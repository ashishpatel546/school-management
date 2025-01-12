import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { DisciplineRecord } from '../../entities/behavior/discipline-record.entity';
import { User } from '../../entities/user.entity';
import { CreateDisciplineRecordDto, ResolveDisciplineRecordDto, UpdateDisciplineRecordDto } from './dto/behavior.dto';

@Injectable()
export class BehaviorService {
  constructor(
    @InjectRepository(DisciplineRecord)
    private disciplineRepository: Repository<DisciplineRecord>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(issuerId: string, createDto: CreateDisciplineRecordDto): Promise<DisciplineRecord> {
    const issuer = await this.userRepository.findOne({ where: { id: issuerId } });
    if (!issuer) {
      throw new NotFoundException(`User with ID ${issuerId} not found`);
    }

    const student = await this.userRepository.findOne({
      where: { id: createDto.studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${createDto.studentId} not found`);
    }

    const record = this.disciplineRepository.create({
      ...createDto,
      student,
      issuedBy: issuer,
    });

    return await this.disciplineRepository.save(record);
  }

  async findAll(): Promise<DisciplineRecord[]> {
    return await this.disciplineRepository.find({
      relations: ['student', 'issuedBy', 'resolvedBy'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<DisciplineRecord> {
    const record = await this.disciplineRepository.findOne({
      where: { id },
      relations: ['student', 'issuedBy', 'resolvedBy'],
    });
    if (!record) {
      throw new NotFoundException(`Discipline record with ID ${id} not found`);
    }
    return record;
  }

  async findByStudent(studentId: string): Promise<DisciplineRecord[]> {
    return await this.disciplineRepository.find({
      where: { student: { id: studentId } },
      relations: ['student', 'issuedBy', 'resolvedBy'],
      order: { date: 'DESC' },
    });
  }

  async update(id: string, updateDto: UpdateDisciplineRecordDto): Promise<DisciplineRecord> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return await this.disciplineRepository.save(record);
  }

  async resolve(id: string, resolverId: string, resolveDto: ResolveDisciplineRecordDto): Promise<DisciplineRecord> {
    const record = await this.findOne(id);
    const resolver = await this.userRepository.findOne({ where: { id: resolverId } });
    if (!resolver) {
      throw new NotFoundException(`User with ID ${resolverId} not found`);
    }

    record.isResolved = resolveDto.isResolved;
    record.resolution = resolveDto.resolution;
    record.resolvedAt = new Date();
    record.resolvedBy = resolver;

    return await this.disciplineRepository.save(record);
  }

  async findUnresolved(): Promise<DisciplineRecord[]> {
    return await this.disciplineRepository.find({
      where: { isResolved: false },
      relations: ['student', 'issuedBy'],
      order: { date: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<DisciplineRecord[]> {
    return await this.disciplineRepository.find({
      where: {
        date: Raw((alias) => `${alias} BETWEEN :start AND :end`, { start: startDate, end: endDate }),
      },
      relations: ['student', 'issuedBy', 'resolvedBy'],
      order: { date: 'DESC' },
    });
  }
}
