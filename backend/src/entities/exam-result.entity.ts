import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exam } from './exam.entity';
import { User } from './user.entity';

@Entity('exam_results')
export class ExamResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Exam)
  exam: Exam;

  @ManyToOne(() => User)
  student: User;

  @Column('float')
  marksObtained: number;

  @Column('float')
  totalMarks: number;

  @Column('float')
  percentage: number;

  @Column({ nullable: true })
  rank: number;

  @Column({ nullable: true })
  teacherComments: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
