import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';

@Entity('promotion_history')
export class PromotionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  student: User;

  @Column()
  userId: string;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'oldClassId' })
  oldClass: Class;

  @Column()
  oldClassId: string;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'newClassId' })
  newClass: Class;

  @Column()
  newClassId: string;

  @Column()
  oldRollNumber: string;

  @Column()
  newRollNumber: string;

  @CreateDateColumn()
  promotedAt: Date;
}
