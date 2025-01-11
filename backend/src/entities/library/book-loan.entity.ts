import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Book } from './book.entity';
import { User } from '../user.entity';

@Entity('book_loans')
export class BookLoan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Book, book => book.loans)
  book: Book;

  @ManyToOne(() => User)
  student: User;

  @Column({ type: 'datetime' })
  borrowedDate: Date;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column({ type: 'datetime', nullable: true })
  returnedDate: Date;

  @Column({ default: false })
  isReturned: boolean;

  @Column({ nullable: true })
  condition: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
