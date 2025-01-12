import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamResult } from '../../entities/exam-result.entity';
import { Exam } from '../../entities/exam.entity';
import { User } from '../../entities/user.entity';
import { CreateExamResultDto, UpdateExamResultDto } from './dto/exam-result.dto';

@Injectable()
export class ExamResultService {
  constructor(
    @InjectRepository(ExamResult)
    private examResultRepository: Repository<ExamResult>,
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateExamResultDto): Promise<ExamResult> {
    const exam = await this.examRepository.findOne({
      where: { id: createDto.examId },
      relations: ['class'],
    });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${createDto.examId} not found`);
    }

    const student = await this.userRepository.findOne({
      where: { id: createDto.studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${createDto.studentId} not found`);
    }

    // Calculate percentage
    const percentage = (createDto.marksObtained / createDto.totalMarks) * 100;

    const result = this.examResultRepository.create({
      ...createDto,
      exam,
      student,
      percentage,
    });

    const savedResult = await this.examResultRepository.save(result);
    await this.computeAndUpdateRanks(exam.id);
    return savedResult;
  }

  async findAll(): Promise<ExamResult[]> {
    return await this.examResultRepository.find({
      relations: ['exam', 'student'],
    });
  }

  async findOne(id: string): Promise<ExamResult> {
    const result = await this.examResultRepository.findOne({
      where: { id },
      relations: ['exam', 'student'],
    });
    if (!result) {
      throw new NotFoundException(`Exam result with ID ${id} not found`);
    }
    return result;
  }

  async update(id: string, updateDto: UpdateExamResultDto): Promise<ExamResult> {
    const result = await this.findOne(id);
    
    if (updateDto.marksObtained || updateDto.totalMarks) {
      const marksObtained = updateDto.marksObtained ?? result.marksObtained;
      const totalMarks = updateDto.totalMarks ?? result.totalMarks;
      result.percentage = (marksObtained / totalMarks) * 100;
    }

    Object.assign(result, updateDto);
    const savedResult = await this.examResultRepository.save(result);
    await this.computeAndUpdateRanks(result.exam.id);
    return savedResult;
  }

  async findByExam(examId: string): Promise<ExamResult[]> {
    return await this.examResultRepository.find({
      where: { exam: { id: examId } },
      relations: ['exam', 'student'],
    });
  }

  async findByStudent(studentId: string): Promise<ExamResult[]> {
    return await this.examResultRepository.find({
      where: { student: { id: studentId } },
      relations: ['exam', 'student'],
    });
  }

  private async computeAndUpdateRanks(examId: string): Promise<void> {
    const results = await this.examResultRepository.find({
      where: { exam: { id: examId } },
      order: { percentage: 'DESC' },
    });

    let currentRank = 1;
    let previousPercentage = null;
    let sameRankCount = 0;

    for (let i = 0; i < results.length; i++) {
      if (previousPercentage === results[i].percentage) {
        sameRankCount++;
      } else {
        currentRank += sameRankCount;
        sameRankCount = 0;
      }

      results[i].rank = currentRank;
      previousPercentage = results[i].percentage;
    }

    await this.examResultRepository.save(results);
  }

  async publishResults(examId: string): Promise<void> {
    const results = await this.examResultRepository.find({
      where: { exam: { id: examId } },
    });

    if (results.length === 0) {
      throw new NotFoundException(`No results found for exam with ID ${examId}`);
    }

    for (const result of results) {
      result.isPublished = true;
    }

    await this.examResultRepository.save(results);
  }
}
