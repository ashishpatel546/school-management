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
exports.ClassController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_service_1 = require("./class.service");
const class_dto_1 = require("./dto/class.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_entity_1 = require("../../entities/user.entity");
let ClassController = class ClassController {
    constructor(classService) {
        this.classService = classService;
    }
    create(createClassDto) {
        return this.classService.create(createClassDto);
    }
    findAll() {
        return this.classService.findAll();
    }
    findOne(id) {
        return this.classService.findOne(id);
    }
    update(id, updateClassDto) {
        return this.classService.update(id, updateClassDto);
    }
    remove(id) {
        return this.classService.remove(id);
    }
    assignTeacher(classId, teacherId) {
        return this.classService.assignTeacher(classId, teacherId);
    }
    assignStudent(classId, studentId) {
        return this.classService.assignStudent(classId, studentId);
    }
};
exports.ClassController = ClassController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new class',
        description: 'Create a new class with grade, section, and base fee information.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Class created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires admin privileges' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [class_dto_1.CreateClassDto]),
    __metadata("design:returntype", void 0)
], ClassController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all classes',
        description: 'Retrieve a list of all classes with their associated teachers and students.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all classes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a class by id',
        description: 'Retrieve detailed information about a specific class.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Class ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Class found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Class not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a class',
        description: 'Update class details including name, grade, section, and base fee.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Class ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Class updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires admin privileges' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Class not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, class_dto_1.UpdateClassDto]),
    __metadata("design:returntype", void 0)
], ClassController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a class',
        description: 'Delete a class and its associations. Only available to super administrators.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Class ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Class deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires super admin privileges' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Class not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':classId/teachers/:teacherId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign a teacher to a class',
        description: 'Associate a teacher with a specific class for teaching responsibilities.'
    }),
    (0, swagger_1.ApiParam)({ name: 'classId', description: 'Class ID' }),
    (0, swagger_1.ApiParam)({ name: 'teacherId', description: 'Teacher ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Teacher assigned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires admin privileges' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Class or teacher not found' }),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Param)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClassController.prototype, "assignTeacher", null);
__decorate([
    (0, common_1.Post)(':classId/students/:studentId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a student to a class' }),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClassController.prototype, "assignStudent", null);
exports.ClassController = ClassController = __decorate([
    (0, swagger_1.ApiTags)('Classes'),
    (0, common_1.Controller)('classes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [class_service_1.ClassService])
], ClassController);
//# sourceMappingURL=class.controller.js.map