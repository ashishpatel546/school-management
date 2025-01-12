import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { CreateStudentDto } from '../../auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private generateRegistrationNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `STU${year}${random}`;
  }

  private async ensureUniqueRegistrationNumber(registrationNumber: string): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { registrationNumber },
    });
    return !existingUser;
  }

  private async generateUniqueRegistrationNumber(): Promise<string> {
    let registrationNumber = this.generateRegistrationNumber();
    let isUnique = await this.ensureUniqueRegistrationNumber(registrationNumber);

    while (!isUnique) {
      registrationNumber = this.generateRegistrationNumber();
      isUnique = await this.ensureUniqueRegistrationNumber(registrationNumber);
    }

    return registrationNumber;
  }

  async createStudent(createStudentDto: CreateStudentDto): Promise<User> {
    const { registrationNumber: providedRegNumber, ...userData } = createStudentDto;

    // If registration number is provided, verify uniqueness
    if (providedRegNumber) {
      const isUnique = await this.ensureUniqueRegistrationNumber(providedRegNumber);
      if (!isUnique) {
        throw new ConflictException('Registration number already exists');
      }
    }

    // Generate or use provided registration number
    const registrationNumber = providedRegNumber || await this.generateUniqueRegistrationNumber();

    // Hash the default password (1234)
    const hashedPassword = await bcrypt.hash('1234', 10);

    const user = this.userRepository.create({
      ...userData,
      registrationNumber,
      password: hashedPassword,
      role: UserRole.STUDENT,
      isFirstLogin: true,
    });

    return await this.userRepository.save(user);
  }

  async findByRegistrationNumber(registrationNumber: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { registrationNumber },
    });
    if (!user) {
      throw new NotFoundException(`User with registration number ${registrationNumber} not found`);
    }
    return user;
  }

  async updateRollNumber(userId: string, rollNumber: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.rollNumber = rollNumber;
    return await this.userRepository.save(user);
  }
}
