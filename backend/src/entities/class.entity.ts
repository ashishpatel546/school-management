import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grade: number;

  @Column()
  section: string;

  @Column('float')
  baseFee: number;

  @OneToMany(() => User, user => user.class)
  students: User[];

  @ManyToMany(() => User)
  @JoinTable()
  teachers: User[];
}
