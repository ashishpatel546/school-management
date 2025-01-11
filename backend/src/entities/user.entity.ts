import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Class } from './class.entity';
import { ExtraCurriculum } from './extra-curriculum.entity';

export enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  mobileNumber: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  role: UserRole;

  @Column({ default: true })
  isFirstLogin: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Class, cls => cls.students, { nullable: true })
  @JoinColumn({ name: 'classId' })
  class: Class;

  @Column({ nullable: true })
  classId: string;

  @ManyToMany(() => ExtraCurriculum, ec => ec.students)
  @JoinTable({
    name: 'extra_curriculum_students',
    joinColumn: { name: 'usersId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'extraCurriculumId', referencedColumnName: 'id' }
  })
  extraCurriculums: ExtraCurriculum[];
}
