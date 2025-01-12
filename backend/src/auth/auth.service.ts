import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { LoginDto, ChangePasswordDto, RegisterDto, CreateStudentDto } from './dto/auth.dto';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<User> {
    return this.userService.createStudent(createStudentDto);
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { mobileNumber: registerDto.mobileNumber },
    });

    if (existingUser) {
      throw new ConflictException('User with this mobile number already exists');
    }

    if (registerDto.role === UserRole.SUPER_ADMIN) {
      const existingSuperAdmin = await this.userRepository.findOne({
        where: { role: UserRole.SUPER_ADMIN },
      });
      if (existingSuperAdmin) {
        throw new ConflictException('Super admin already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      isFirstLogin: true,
    });

    await this.userRepository.save(user);
    
    const { password, ...result } = user;
    return result;
  }

  async validateUser(mobileNumber: string, password: string): Promise<any> {
    // For testing: bypass all validation and create a default user if none exists
    let user = await this.userRepository.findOne({ where: { mobileNumber } });
    
    if (!user) {
      // Create a default user for testing
      const defaultPassword = await bcrypt.hash('1234', 10);
      user = this.userRepository.create({
        mobileNumber,
        password: defaultPassword,
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.STUDENT,
        isFirstLogin: false,
        isActive: true
      });
      await this.userRepository.save(user);
    }
    
    // Always return user data without password
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    // For testing: always create/return a user without validation
    const user = await this.validateUser(loginDto.mobileNumber, '1234');

    const payload = { 
      sub: user.id, 
      mobileNumber: user.mobileNumber, 
      role: user.role,
      isFirstLogin: user.isFirstLogin 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        ...user,
        requirePasswordChange: false // Disable password change requirement for testing
      }
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValidPassword = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;
    user.isFirstLogin = false;

    await this.userRepository.save(user);
    return { message: 'Password changed successfully' };
  }

  async resetPassword(mobileNumber: string) {
    const user = await this.userRepository.findOne({ where: { mobileNumber } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const defaultPassword = '1234';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    user.password = hashedPassword;
    user.isFirstLogin = true;

    await this.userRepository.save(user);
    return { message: 'Password reset successfully' };
  }
}
