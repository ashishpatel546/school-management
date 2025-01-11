import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Club } from './club.entity';
import { User } from '../user.entity';

export enum EventStatus {
  PLANNED = 'planned',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('club_events')
export class ClubEvent {
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

  @ManyToOne(() => Club, club => club.events)
  club: Club;

  @ManyToOne(() => User)
  organizer: User;

  @Column({
    type: 'varchar',
    enum: EventStatus,
    default: EventStatus.PLANNED
  })
  status: EventStatus;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'simple-array', nullable: true })
  resources: string[];

  @Column({ default: 0 })
  maxParticipants: number;

  @Column({ default: false })
  requiresRegistration: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
