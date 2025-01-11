import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../../entities/subject.entity';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { Class } from '../../entities/class.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const { classIds, ...subjectData } = createSubjectDto;
    const subject = this.subjectRepository.create(subjectData);

    if (classIds && classIds.length > 0) {
      const classes = await this.classRepository.findByIds(classIds);
      subject.classes = classes;
    }

    return await this.subjectRepository.save(subject);
  }

  async findAll(): Promise<Subject[]> {
    return await this.subjectRepository.find({
      relations: ['classes'],
    });
  }

  async findOne(id: string): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['classes'],
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findOne(id);
    Object.assign(subject, updateSubjectDto);
    return await this.subjectRepository.save(subject);
  }

  async remove(id: string): Promise<void> {
    const result = await this.subjectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
  }

  async assignToClass(subjectId: string, classId: string): Promise<Subject> {
    const subject = await this.findOne(subjectId);
    const classEntity = await this.classRepository.findOne({ where: { id: classId } });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    subject.classes = [...(subject.classes || []), classEntity];
    return await this.subjectRepository.save(subject);
  }
}
