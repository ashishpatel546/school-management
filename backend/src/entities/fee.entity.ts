import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';

export enum FeeStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue'
}

@Entity('fees')
export class Fee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'studentId', referencedColumnName: 'id' })
  student: User;

  @ManyToOne(() => Class, { eager: true })
  @JoinColumn({ name: 'classId', referencedColumnName: 'id' })
  class: Class;

  @Column({ name: 'studentId' })
  studentId: string;

  @Column({ name: 'classId' })
  classId: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'float', default: 0 })
  extraCurriculumFee: number;

  @Column({ type: 'float' })
  totalAmount: number;

  @Column({ default: FeeStatus.PENDING })
  status: FeeStatus;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  paidDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
