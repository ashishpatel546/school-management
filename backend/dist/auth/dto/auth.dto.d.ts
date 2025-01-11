import { UserRole } from '../../entities/user.entity';
export declare class RegisterDto {
    mobileNumber: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    password: string;
}
export declare class LoginDto {
    mobileNumber: string;
    password: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class ResetPasswordDto {
    mobileNumber: string;
}
