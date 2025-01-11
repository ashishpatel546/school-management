import { AuthService } from './auth.service';
import { LoginDto, ChangePasswordDto, ResetPasswordDto, RegisterDto } from './dto/auth.dto';
import { UserRole } from '../entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
