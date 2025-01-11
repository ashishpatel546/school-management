import { AdminService } from './admin.service';
import { AssignAdminRoleDto } from './dto/admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    assignAdminRole(assignAdminRoleDto: AssignAdminRoleDto, currentUserId: string): Promise<import("../../entities/user.entity").User>;
    findAllAdmins(): Promise<import("../../entities/user.entity").User[]>;
    findSuperAdmin(): Promise<import("../../entities/user.entity").User>;
    revokeAdminRole(userId: string, currentUserId: string): Promise<import("../../entities/user.entity").User>;
}
