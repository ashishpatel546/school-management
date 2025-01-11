import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Resource } from './resource.entity';
import { User } from '../user.entity';

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

@Entity('resource_bookings')
export class ResourceBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Resource, resource => resource.bookings)
  resource: Resource;

  @ManyToOne(() => User)
  requestedBy: User;

  @ManyToOne(() => User, { nullable: true })
  approvedBy: User;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({
    type: 'varchar',
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
