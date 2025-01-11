import { UserRole } from '../../../entities/user.entity';
export declare class AssignAdminRoleDto {
    userId: string;
    role: UserRole;
}
export declare class UpdateAdminPermissionsDto {
    userId: string;
    permissions: string[];
}
