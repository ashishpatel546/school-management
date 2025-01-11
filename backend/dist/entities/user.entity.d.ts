import { Class } from './class.entity';
import { ExtraCurriculum } from './extra-curriculum.entity';
export declare enum UserRole {
    STUDENT = "student",
    PARENT = "parent",
    TEACHER = "teacher",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
export declare class User {
    id: string;
    mobileNumber: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isFirstLogin: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    class: Class;
    classId: string;
    extraCurriculums: ExtraCurriculum[];
}
