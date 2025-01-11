"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
let AdminService = class AdminService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async assignAdminRole(assignAdminRoleDto, currentUserId) {
        const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
        if (!currentUser || currentUser.role !== user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only super admin can assign admin roles');
        }
        const user = await this.userRepository.findOne({ where: { id: assignAdminRoleDto.userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${assignAdminRoleDto.userId} not found`);
        }
        if (assignAdminRoleDto.role === user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Cannot assign super admin role');
        }
        user.role = assignAdminRoleDto.role;
        return await this.userRepository.save(user);
    }
    async findAllAdmins() {
        return await this.userRepository.find({
            where: [
                { role: user_entity_1.UserRole.ADMIN },
                { role: user_entity_1.UserRole.SUPER_ADMIN }
            ],
        });
    }
    async findSuperAdmin() {
        return await this.userRepository.findOne({
            where: { role: user_entity_1.UserRole.SUPER_ADMIN },
        });
    }
    async revokeAdminRole(userId, currentUserId) {
        const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
        if (!currentUser || currentUser.role !== user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only super admin can revoke admin roles');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        if (user.role === user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Cannot revoke super admin role');
        }
        if (user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('User is not an admin');
        }
        user.role = user_entity_1.UserRole.TEACHER;
        return await this.userRepository.save(user);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map