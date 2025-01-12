import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user.entity';

export enum DisciplineType {
  WARNING = 'warning',
  DETENTION = 'detention',
  SUSPENSION = 'suspension',
  EXPULSION = 'expulsion',
  MERIT = 'merit',
  DEMERIT = 'demerit'
}

@Entity('discipline_records')
export class DisciplineRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  student: User;

  @ManyToOne(() => User)
  issuedBy: User;

  @Column({
    type: 'varchar',
    enum: DisciplineType,
    default: DisciplineType.WARNING
  })
  type: DisciplineType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  points: number;

  @Column({ default: false })
  isResolved: boolean;

  @Column({ type: 'text', nullable: true })
  resolution: string;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  resolvedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
