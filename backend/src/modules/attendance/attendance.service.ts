import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../../entities/attendance.entity';
import { User } from '../../entities/user.entity';
import { Class } from '../../entities/class.entity';
import { CreateAttendanceDto, UpdateAttendanceDto, BulkCreateAttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto, teacherId: string): Promise<Attendance> {
    const student = await this.userRepository.findOne({
      where: { id: createAttendanceDto.studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${createAttendanceDto.studentId} not found`);
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: createAttendanceDto.classId },
    });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${createAttendanceDto.classId} not found`);
    }

    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    const attendance = this.attendanceRepository.create({
      ...createAttendanceDto,
      student,
      class: classEntity,
      markedBy: teacher,
    });

    return await this.attendanceRepository.save(attendance);
  }

  async bulkCreate(bulkCreateDto: BulkCreateAttendanceDto, teacherId: string): Promise<Attendance[]> {
    const classEntity = await this.classRepository.findOne({
      where: { id: bulkCreateDto.classId },
      relations: ['students'],
    });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${bulkCreateDto.classId} not found`);
    }

    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    const attendances = classEntity.students.map(student => {
      return this.attendanceRepository.create({
        student,
        class: classEntity,
        date: bulkCreateDto.date,
        present: bulkCreateDto.presentStudentIds.includes(student.id),
        markedBy: teacher,
      });
    });

    return await this.attendanceRepository.save(attendances);
  }

  async findAll(): Promise<Attendance[]> {
    return await this.attendanceRepository.find({
      relations: ['student', 'class', 'markedBy'],
    });
  }

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['student', 'class', 'markedBy'],
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);
    Object.assign(attendance, updateAttendanceDto);
    return await this.attendanceRepository.save(attendance);
  }

  async findByClass(classId: string, date: Date): Promise<Attendance[]> {
    return await this.attendanceRepository.find({
      where: {
        class: { id: classId },
        date,
      },
      relations: ['student', 'class', 'markedBy'],
    });
  }

  async findByStudent(studentId: string): Promise<Attendance[]> {
    return await this.attendanceRepository.find({
      where: {
        student: { id: studentId },
      },
      relations: ['student', 'class', 'markedBy'],
    });
  }
}
