import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LibraryService } from './library.service';
import { CreateBookDto, CreateBookLoanDto, UpdateBookLoanDto } from './dto/library.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';

@ApiTags('Library')
@Controller('library')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post('books')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new book' })
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.libraryService.createBook(createBookDto);
  }

  @Get('books')
  @ApiOperation({ summary: 'Get all books' })
  findAllBooks() {
    return this.libraryService.findAllBooks();
  }

  @Get('books/:id')
  @ApiOperation({ summary: 'Get a book by id' })
  findBookById(@Param('id') id: string) {
    return this.libraryService.findBookById(id);
  }

  @Post('loans')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Create a new book loan' })
  createLoan(@Body() createLoanDto: CreateBookLoanDto) {
    return this.libraryService.createLoan(createLoanDto);
  }

  @Patch('loans/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Update a book loan' })
  updateLoan(
    @Param('id') id: string,
    @Body() updateLoanDto: UpdateBookLoanDto,
  ) {
    return this.libraryService.updateLoan(id, updateLoanDto);
  }

  @Get('loans/student')
  @ApiOperation({ summary: 'Get loans for current student' })
  findMyLoans(@User('id') studentId: string) {
    return this.libraryService.findLoansByStudent(studentId);
  }

  @Get('loans/overdue')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get all overdue loans' })
  findOverdueLoans() {
    return this.libraryService.findOverdueLoans();
  }
}
