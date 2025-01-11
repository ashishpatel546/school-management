import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtraCurriculum } from '../../entities/extra-curriculum.entity';
import { CreateExtraCurriculumDto, UpdateExtraCurriculumDto } from './dto/extra-curriculum.dto';

@Injectable()
export class ExtraCurriculumService {
  constructor(
    @InjectRepository(ExtraCurriculum)
    private extraCurriculumRepository: Repository<ExtraCurriculum>,
  ) {}

  async create(createDto: CreateExtraCurriculumDto): Promise<ExtraCurriculum> {
    const extraCurriculum = this.extraCurriculumRepository.create(createDto);
    return await this.extraCurriculumRepository.save(extraCurriculum);
  }

  async findAll(): Promise<ExtraCurriculum[]> {
    return await this.extraCurriculumRepository.find({
      relations: ['students'],
    });
  }

  async findOne(id: string): Promise<ExtraCurriculum> {
    const extraCurriculum = await this.extraCurriculumRepository.findOne({
      where: { id },
      relations: ['students'],
    });
    if (!extraCurriculum) {
      throw new NotFoundException(`Extra curriculum with ID ${id} not found`);
    }
    return extraCurriculum;
  }

  async update(id: string, updateDto: UpdateExtraCurriculumDto): Promise<ExtraCurriculum> {
    const extraCurriculum = await this.findOne(id);
    Object.assign(extraCurriculum, updateDto);
    return await this.extraCurriculumRepository.save(extraCurriculum);
  }

  async remove(id: string): Promise<void> {
    const result = await this.extraCurriculumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Extra curriculum with ID ${id} not found`);
    }
  }

  async assignStudent(id: string, studentId: string): Promise<ExtraCurriculum> {
    const extraCurriculum = await this.findOne(id);
    extraCurriculum.students = [...(extraCurriculum.students || []), { id: studentId } as any];
    return await this.extraCurriculumRepository.save(extraCurriculum);
  }
}
