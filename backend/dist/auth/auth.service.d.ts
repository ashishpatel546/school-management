import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { LoginDto, ChangePasswordDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        id: string;
        mobileNumber: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        isFirstLogin: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        class: import("../entities/class.entity").Class;
        classId: string;
        extraCurriculums: import("../entities/extra-curriculum.entity").ExtraCurriculum[];
    }>;
    validateUser(mobileNumber: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(mobileNumber: string): Promise<{
        message: string;
    }>;
}
