import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user.entity';
import { Assignment } from './assignment.entity';

@Entity('assignment_submissions')
export class AssignmentSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Assignment, assignment => assignment.submissions)
  assignment: Assignment;

  @ManyToOne(() => User)
  student: User;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  attachmentUrl: string;

  @Column({ type: 'float', nullable: true })
  marks: number;

  @Column({ type: 'text', nullable: true })
  teacherFeedback: string;

  @Column({ default: false })
  isGraded: boolean;

  @Column({ type: 'datetime', nullable: true })
  submittedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
