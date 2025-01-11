import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  student: User;

  @ManyToOne(() => Class)
  class: Class;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: false })
  present: boolean;

  @ManyToOne(() => User)
  markedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
