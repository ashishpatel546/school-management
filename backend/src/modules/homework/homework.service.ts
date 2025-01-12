import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from '../../entities/homework/assignment.entity';
import { AssignmentSubmission } from '../../entities/homework/assignment-submission.entity';
import { User } from '../../entities/user.entity';
import { Class } from '../../entities/class.entity';
import { Subject } from '../../entities/subject.entity';
import { CreateAssignmentDto, CreateSubmissionDto, GradeSubmissionDto } from './dto/homework.dto';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(AssignmentSubmission)
    private submissionRepository: Repository<AssignmentSubmission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async createAssignment(teacherId: string, createDto: CreateAssignmentDto): Promise<Assignment> {
    const teacher = await this.userRepository.findOne({ where: { id: teacherId } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: createDto.classId },
    });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${createDto.classId} not found`);
    }

    const subject = await this.subjectRepository.findOne({
      where: { id: createDto.subjectId },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${createDto.subjectId} not found`);
    }

    const assignment = this.assignmentRepository.create({
      ...createDto,
      teacher,
      class: classEntity,
      subject,
    });

    return await this.assignmentRepository.save(assignment);
  }

  async findAllAssignments(): Promise<Assignment[]> {
    return await this.assignmentRepository.find({
      relations: ['teacher', 'class', 'subject', 'submissions'],
    });
  }

  async findAssignmentsByClass(classId: string): Promise<Assignment[]> {
    return await this.assignmentRepository.find({
      where: { class: { id: classId } },
      relations: ['teacher', 'class', 'subject', 'submissions'],
    });
  }

  async findAssignmentsByStudent(studentId: string): Promise<Assignment[]> {
    const student = await this.userRepository.findOne({
      where: { id: studentId },
      relations: ['class'],
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return await this.assignmentRepository.find({
      where: { class: { id: student.class.id } },
      relations: ['teacher', 'class', 'subject', 'submissions'],
    });
  }

  async createSubmission(studentId: string, createDto: CreateSubmissionDto): Promise<AssignmentSubmission> {
    const student = await this.userRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const assignment = await this.assignmentRepository.findOne({
      where: { id: createDto.assignmentId },
    });
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${createDto.assignmentId} not found`);
    }

    // Check if submission already exists
    const existingSubmission = await this.submissionRepository.findOne({
      where: {
        student: { id: studentId },
        assignment: { id: createDto.assignmentId },
      },
    });

    if (existingSubmission) {
      throw new BadRequestException('Submission already exists for this assignment');
    }

    const submission = this.submissionRepository.create({
      ...createDto,
      student,
      assignment,
      submittedAt: new Date(),
    });

    return await this.submissionRepository.save(submission);
  }

  async gradeSubmission(submissionId: string, gradeDto: GradeSubmissionDto): Promise<AssignmentSubmission> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: ['assignment'],
    });
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${submissionId} not found`);
    }

    if (gradeDto.marks > submission.assignment.totalMarks) {
      throw new BadRequestException(`Marks cannot exceed total marks (${submission.assignment.totalMarks})`);
    }

    submission.marks = gradeDto.marks;
    submission.teacherFeedback = gradeDto.teacherFeedback;
    submission.isGraded = true;

    return await this.submissionRepository.save(submission);
  }

  async findSubmissionsByAssignment(assignmentId: string): Promise<AssignmentSubmission[]> {
    return await this.submissionRepository.find({
      where: { assignment: { id: assignmentId } },
      relations: ['student', 'assignment'],
    });
  }

  async findSubmissionsByStudent(studentId: string): Promise<AssignmentSubmission[]> {
    return await this.submissionRepository.find({
      where: { student: { id: studentId } },
      relations: ['assignment', 'assignment.teacher', 'assignment.subject'],
    });
  }
}
