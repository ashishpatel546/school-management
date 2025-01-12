import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user.entity';

export enum EmploymentStatus {
  EMPLOYED = 'employed',
  SELF_EMPLOYED = 'self_employed',
  STUDENT = 'student',
  UNEMPLOYED = 'unemployed'
}

@Entity('alumni')
export class Alumni {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'int' })
  graduationYear: number;

  @Column({ nullable: true })
  college: string;

  @Column({ nullable: true })
  degree: string;

  @Column({
    type: 'varchar',
    enum: EmploymentStatus,
    default: EmploymentStatus.STUDENT
  })
  employmentStatus: EmploymentStatus;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ type: 'text', nullable: true })
  achievements: string;

  @Column({ nullable: true })
  linkedinProfile: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
