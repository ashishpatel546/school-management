import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumni, EmploymentStatus } from '../../entities/alumni/alumni.entity';
import { User } from '../../entities/user.entity';
import { CreateAlumniDto, UpdateAlumniDto } from './dto/alumni.dto';

@Injectable()
export class AlumniService {
  constructor(
    @InjectRepository(Alumni)
    private alumniRepository: Repository<Alumni>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateAlumniDto): Promise<Alumni> {
    const user = await this.userRepository.findOne({
      where: { id: createDto.userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${createDto.userId} not found`);
    }

    const alumni = this.alumniRepository.create({
      ...createDto,
      user,
    });

    return await this.alumniRepository.save(alumni);
  }

  async findAll(): Promise<Alumni[]> {
    return await this.alumniRepository.find({
      relations: ['user'],
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Alumni> {
    const alumni = await this.alumniRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!alumni) {
      throw new NotFoundException(`Alumni with ID ${id} not found`);
    }
    return alumni;
  }

  async update(id: string, updateDto: UpdateAlumniDto): Promise<Alumni> {
    const alumni = await this.findOne(id);
    Object.assign(alumni, updateDto);
    return await this.alumniRepository.save(alumni);
  }

  async remove(id: string): Promise<void> {
    const alumni = await this.findOne(id);
    alumni.isActive = false;
    await this.alumniRepository.save(alumni);
  }

  async findByGraduationYear(year: number): Promise<Alumni[]> {
    return await this.alumniRepository.find({
      where: { graduationYear: year, isActive: true },
      relations: ['user'],
    });
  }

  async findByEmploymentStatus(status: string): Promise<Alumni[]> {
    return await this.alumniRepository.find({
      where: { employmentStatus: status as EmploymentStatus, isActive: true },
      relations: ['user'],
    });
  }
}
