import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../../entities/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  receiver: User;

  @Column()
  content: string;

  @Column({ type: 'datetime' })
  timestamp: Date;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  subject: string;

  @CreateDateColumn()
  createdAt: Date;
}
