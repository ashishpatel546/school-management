import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Class } from './class.entity';
import { Subject } from './subject.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Class)
  class: Class;

  @ManyToOne(() => Subject)
  subject: Subject;

  @CreateDateColumn()
  createdAt: Date;
}
