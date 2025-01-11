import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../../entities/exam.entity';
import { Class } from '../../entities/class.entity';
import { Subject } from '../../entities/subject.entity';
import { CreateExamDto, UpdateExamDto } from './dto/exam.dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const classEntity = await this.classRepository.findOne({
      where: { id: createExamDto.classId },
    });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${createExamDto.classId} not found`);
    }

    const subject = await this.subjectRepository.findOne({
      where: { id: createExamDto.subjectId },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${createExamDto.subjectId} not found`);
    }

    const exam = this.examRepository.create({
      name: createExamDto.name,
      date: createExamDto.date,
      description: createExamDto.description,
      class: classEntity,
      subject: subject,
    });

    return await this.examRepository.save(exam);
  }

  async findAll(): Promise<Exam[]> {
    return await this.examRepository.find({
      relations: ['class', 'subject'],
    });
  }

  async findOne(id: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['class', 'subject'],
    });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    return exam;
  }

  async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);
    Object.assign(exam, updateExamDto);
    return await this.examRepository.save(exam);
  }

  async remove(id: string): Promise<void> {
    const result = await this.examRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
  }

  async findByClass(classId: string): Promise<Exam[]> {
    return await this.examRepository.find({
      where: { class: { id: classId } },
      relations: ['class', 'subject'],
    });
  }
}
