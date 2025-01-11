import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { AssignAdminRoleDto } from './dto/admin.dto';
export declare class AdminService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    assignAdminRole(assignAdminRoleDto: AssignAdminRoleDto, currentUserId: string): Promise<User>;
    findAllAdmins(): Promise<User[]>;
    findSuperAdmin(): Promise<User>;
    revokeAdminRole(userId: string, currentUserId: string): Promise<User>;
}
