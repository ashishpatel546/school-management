import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ResourceBooking } from './resource-booking.entity';

export enum ResourceType {
  CLASSROOM = 'classroom',
  LABORATORY = 'laboratory',
  AUDITORIUM = 'auditorium',
  SPORTS_EQUIPMENT = 'sports_equipment',
  PROJECTOR = 'projector',
  COMPUTER = 'computer',
  OTHER = 'other'
}

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    enum: ResourceType,
    default: ResourceType.OTHER
  })
  type: ResourceType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  capacity: number;

  @OneToMany(() => ResourceBooking, booking => booking.resource)
  bookings: ResourceBooking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
