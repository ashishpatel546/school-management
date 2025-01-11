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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const existingUser = await this.userRepository.findOne({
            where: { mobileNumber: registerDto.mobileNumber },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this mobile number already exists');
        }
        if (registerDto.role === user_entity_1.UserRole.SUPER_ADMIN) {
            const existingSuperAdmin = await this.userRepository.findOne({
                where: { role: user_entity_1.UserRole.SUPER_ADMIN },
            });
            if (existingSuperAdmin) {
                throw new common_1.ConflictException('Super admin already exists');
            }
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.userRepository.create({
            ...registerDto,
            password: hashedPassword,
            isFirstLogin: true,
        });
        await this.userRepository.save(user);
        const { password, ...result } = user;
        return result;
    }
    async validateUser(mobileNumber, password) {
        const user = await this.userRepository.findOne({ where: { mobileNumber } });
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.mobileNumber, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            mobileNumber: user.mobileNumber,
            role: user.role,
            isFirstLogin: user.isFirstLogin
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                ...user,
                requirePasswordChange: user.isFirstLogin
            }
        };
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isValidPassword = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        user.password = hashedPassword;
        user.isFirstLogin = false;
        await this.userRepository.save(user);
        return { message: 'Password changed successfully' };
    }
    async resetPassword(mobileNumber) {
        const user = await this.userRepository.findOne({ where: { mobileNumber } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const defaultPassword = '1234';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        user.password = hashedPassword;
        user.isFirstLogin = true;
        await this.userRepository.save(user);
        return { message: 'Password reset successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map