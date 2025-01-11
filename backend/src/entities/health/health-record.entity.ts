import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user.entity';

export enum VisitType {
  ROUTINE_CHECKUP = 'routine_checkup',
  EMERGENCY = 'emergency',
  VACCINATION = 'vaccination',
  INJURY = 'injury',
  ILLNESS = 'illness'
}

@Entity('health_records')
export class HealthRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  student: User;

  @ManyToOne(() => User)
  attendedBy: User;

  @Column({
    type: 'varchar',
    enum: VisitType,
    default: VisitType.ROUTINE_CHECKUP
  })
  visitType: VisitType;

  @Column({ type: 'datetime' })
  visitDate: Date;

  @Column({ type: 'text' })
  symptoms: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  treatment: string;

  @Column({ type: 'text', nullable: true })
  prescription: string;

  @Column({ type: 'simple-array', nullable: true })
  allergies: string[];

  @Column({ type: 'simple-array', nullable: true })
  medications: string[];

  @Column({ default: false })
  followUpRequired: boolean;

  @Column({ type: 'datetime', nullable: true })
  followUpDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  isEmergencyContact: boolean;

  @Column({ nullable: true })
  emergencyContactName: string;

  @Column({ nullable: true })
  emergencyContactNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
