import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user.entity';
import { Class } from '../class.entity';
import { Subject } from '../subject.entity';
import { AssignmentSubmission } from './assignment-submission.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @ManyToOne(() => User)
  teacher: User;

  @ManyToOne(() => Class)
  class: Class;

  @ManyToOne(() => Subject)
  subject: Subject;

  @Column({ default: 100 })
  totalMarks: number;

  @Column({ nullable: true })
  attachmentUrl: string;

  @OneToMany(() => AssignmentSubmission, submission => submission.assignment)
  submissions: AssignmentSubmission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
