import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user.entity';
import { ClubEvent } from './club-event.entity';

export enum ClubCategory {
  ACADEMIC = 'academic',
  SPORTS = 'sports',
  ARTS = 'arts',
  TECHNOLOGY = 'technology',
  CULTURE = 'culture',
  SOCIAL = 'social',
  OTHER = 'other'
}

@Entity('clubs')
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    enum: ClubCategory,
    default: ClubCategory.OTHER
  })
  category: ClubCategory;

  @ManyToOne(() => User)
  supervisor: User;

  @ManyToMany(() => User)
  members: User[];

  @OneToMany(() => ClubEvent, event => event.club)
  events: ClubEvent[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  meetingSchedule: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'simple-array', nullable: true })
  requirements: string[];

  @Column({ default: 0 })
  maxMembers: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
