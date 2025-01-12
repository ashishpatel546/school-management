import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../../entities/class.entity';
import { User } from '../../entities/user.entity';
import { PromotionHistory } from '../../entities/promotion-history.entity';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PromotionHistory)
    private promotionHistoryRepository: Repository<PromotionHistory>,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const newClass = this.classRepository.create(createClassDto);
    return await this.classRepository.save(newClass);
  }

  async findAll(): Promise<Class[]> {
    return await this.classRepository.find({
      relations: ['teachers', 'students'],
    });
  }

  async findOne(id: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['teachers', 'students'],
    });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return classEntity;
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const classEntity = await this.findOne(id);
    Object.assign(classEntity, updateClassDto);
    return await this.classRepository.save(classEntity);
  }

  async remove(id: string): Promise<void> {
    const result = await this.classRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
  }

  async assignTeacher(classId: string, teacherId: string): Promise<Class> {
    const classEntity = await this.findOne(classId);
    classEntity.teachers = [...(classEntity.teachers || []), { id: teacherId } as any];
    return await this.classRepository.save(classEntity);
  }

  async assignStudent(classId: string, studentId: string): Promise<Class> {
    const classEntity = await this.findOne(classId);
    classEntity.students = [...(classEntity.students || []), { id: studentId } as any];
    return await this.classRepository.save(classEntity);
  }

  async promoteStudent(studentId: string, newClassId: string, newRollNumber: string): Promise<User> {
    const student = await this.userRepository.findOne({
      where: { id: studentId },
      relations: ['class'],
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const newClass = await this.findOne(newClassId);
    if (!newClass) {
      throw new NotFoundException(`Class with ID ${newClassId} not found`);
    }

    const oldClass = student.class;
    const oldRollNumber = student.rollNumber;

    // Update class and roll number while preserving registration number
    student.class = newClass;
    student.classId = newClassId;
    student.rollNumber = newRollNumber;

    const updatedStudent = await this.userRepository.save(student);

    // Log promotion history
    const promotionHistory = this.promotionHistoryRepository.create({
      student: updatedStudent,
      userId: studentId,
      oldClass,
      oldClassId: oldClass?.id,
      newClass,
      newClassId,
      oldRollNumber,
      newRollNumber,
    });

    await this.promotionHistoryRepository.save(promotionHistory);

    return updatedStudent;
  }

  async batchPromoteStudents(fromClassId: string, toClassId: string, studentIds: string[]): Promise<User[]> {
    // Verify classes exist
    const fromClass = await this.findOne(fromClassId);
    const toClass = await this.findOne(toClassId);

    if (!fromClass || !toClass) {
      throw new NotFoundException('Source or target class not found');
    }

    // Get current max roll number in target class
    const existingStudents = await this.userRepository.find({
      where: { classId: toClassId },
      order: { rollNumber: 'DESC' },
      take: 1,
    });

    let nextRollNumber = 1;
    if (existingStudents.length > 0 && existingStudents[0].rollNumber) {
      const currentMax = parseInt(existingStudents[0].rollNumber.replace(/\D/g, ''));
      nextRollNumber = currentMax + 1;
    }

    const promotedStudents: User[] = [];

    // Promote each student
    for (const studentId of studentIds) {
      const rollNumber = `RN${nextRollNumber.toString().padStart(3, '0')}`;
      const promotedStudent = await this.promoteStudent(studentId, toClassId, rollNumber);
      promotedStudents.push(promotedStudent);
      nextRollNumber++;
    }

    return promotedStudents;
  }
}
