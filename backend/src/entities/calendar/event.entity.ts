import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user.entity';

export enum EventType {
  HOLIDAY = 'holiday',
  EXAM = 'exam',
  MEETING = 'meeting',
  ACTIVITY = 'activity',
  OTHER = 'other'
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({
    type: 'varchar',
    enum: EventType,
    default: EventType.OTHER
  })
  type: EventType;

  @Column({ default: false })
  isAllDay: boolean;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => User)
  createdBy: User;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
