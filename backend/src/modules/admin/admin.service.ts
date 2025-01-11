import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { AssignAdminRoleDto, UpdateAdminPermissionsDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async assignAdminRole(assignAdminRoleDto: AssignAdminRoleDto, currentUserId: string): Promise<User> {
    const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
    if (!currentUser || currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can assign admin roles');
    }

    const user = await this.userRepository.findOne({ where: { id: assignAdminRoleDto.userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${assignAdminRoleDto.userId} not found`);
    }

    if (assignAdminRoleDto.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot assign super admin role');
    }

    user.role = assignAdminRoleDto.role;
    return await this.userRepository.save(user);
  }

  async findAllAdmins(): Promise<User[]> {
    return await this.userRepository.find({
      where: [
        { role: UserRole.ADMIN },
        { role: UserRole.SUPER_ADMIN }
      ],
    });
  }

  async findSuperAdmin(): Promise<User> {
    return await this.userRepository.findOne({
      where: { role: UserRole.SUPER_ADMIN },
    });
  }

  async revokeAdminRole(userId: string, currentUserId: string): Promise<User> {
    const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
    if (!currentUser || currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can revoke admin roles');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot revoke super admin role');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('User is not an admin');
    }

    user.role = UserRole.TEACHER;
    return await this.userRepository.save(user);
  }
}
