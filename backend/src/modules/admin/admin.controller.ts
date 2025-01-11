import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AssignAdminRoleDto, UpdateAdminPermissionsDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';

@ApiTags('Admin Management')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('assign-role')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Assign admin role to a user' })
  assignAdminRole(
    @Body() assignAdminRoleDto: AssignAdminRoleDto,
    @User('id') currentUserId: string,
  ) {
    return this.adminService.assignAdminRole(assignAdminRoleDto, currentUserId);
  }

  @Get('all')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all admins' })
  findAllAdmins() {
    return this.adminService.findAllAdmins();
  }

  @Get('super-admin')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get super admin' })
  findSuperAdmin() {
    return this.adminService.findSuperAdmin();
  }

  @Delete(':userId/revoke')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Revoke admin role from a user' })
  revokeAdminRole(
    @Param('userId') userId: string,
    @User('id') currentUserId: string,
  ) {
    return this.adminService.revokeAdminRole(userId, currentUserId);
  }
}
