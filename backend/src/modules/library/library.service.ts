import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../../entities/library/book.entity';
import { BookLoan } from '../../entities/library/book-loan.entity';
import { User } from '../../entities/user.entity';
import { CreateBookDto, CreateBookLoanDto, UpdateBookLoanDto } from './dto/library.dto';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(BookLoan)
    private bookLoanRepository: Repository<BookLoan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = await this.bookRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });

    if (existingBook) {
      throw new BadRequestException(`Book with ISBN ${createBookDto.isbn} already exists`);
    }

    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAllBooks(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async findBookById(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['loans'],
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async createLoan(createLoanDto: CreateBookLoanDto): Promise<BookLoan> {
    const book = await this.findBookById(createLoanDto.bookId);
    if (book.copiesAvailable < 1) {
      throw new BadRequestException('No copies available for loan');
    }

    const student = await this.userRepository.findOne({
      where: { id: createLoanDto.studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${createLoanDto.studentId} not found`);
    }

    const loan = this.bookLoanRepository.create({
      book,
      student,
      borrowedDate: new Date(),
      dueDate: createLoanDto.dueDate,
    });

    book.copiesAvailable -= 1;
    await this.bookRepository.save(book);

    return await this.bookLoanRepository.save(loan);
  }

  async updateLoan(id: string, updateLoanDto: UpdateBookLoanDto): Promise<BookLoan> {
    const loan = await this.bookLoanRepository.findOne({
      where: { id },
      relations: ['book'],
    });
    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    if (updateLoanDto.isReturned && !loan.isReturned) {
      loan.returnedDate = new Date();
      loan.book.copiesAvailable += 1;
      await this.bookRepository.save(loan.book);
    }

    Object.assign(loan, updateLoanDto);
    return await this.bookLoanRepository.save(loan);
  }

  async findLoansByStudent(studentId: string): Promise<BookLoan[]> {
    return await this.bookLoanRepository.find({
      where: { student: { id: studentId } },
      relations: ['book', 'student'],
    });
  }

  async findOverdueLoans(): Promise<BookLoan[]> {
    return await this.bookLoanRepository.find({
      where: {
        isReturned: false,
        dueDate: { $lt: new Date() },
      },
      relations: ['book', 'student'],
    });
  }
}
