import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';

@Entity('extra_curriculum')
export class ExtraCurriculum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('float')
  fee: number;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, user => user.extraCurriculums)
  students: User[];
}
