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
exports.ExtraCurriculumController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const extra_curriculum_service_1 = require("./extra-curriculum.service");
const extra_curriculum_dto_1 = require("./dto/extra-curriculum.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_entity_1 = require("../../entities/user.entity");
let ExtraCurriculumController = class ExtraCurriculumController {
    constructor(extraCurriculumService) {
        this.extraCurriculumService = extraCurriculumService;
    }
    create(createDto) {
        return this.extraCurriculumService.create(createDto);
    }
    findAll() {
        return this.extraCurriculumService.findAll();
    }
    findOne(id) {
        return this.extraCurriculumService.findOne(id);
    }
    update(id, updateDto) {
        return this.extraCurriculumService.update(id, updateDto);
    }
    remove(id) {
        return this.extraCurriculumService.remove(id);
    }
    assignStudent(id, studentId) {
        return this.extraCurriculumService.assignStudent(id, studentId);
    }
};
exports.ExtraCurriculumController = ExtraCurriculumController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new extra curriculum activity',
        description: 'Create a new extra curriculum activity with name, fee, and description.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Extra curriculum activity created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires admin privileges' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [extra_curriculum_dto_1.CreateExtraCurriculumDto]),
    __metadata("design:returntype", void 0)
], ExtraCurriculumController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all extra curriculum activities',
        description: 'Retrieve a list of all available extra curriculum activities with their fees.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all extra curriculum activities' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExtraCurriculumController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get an extra curriculum activity by id',
        description: 'Retrieve detailed information about a specific extra curriculum activity.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Extra curriculum activity ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Extra curriculum activity found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Extra curriculum activity not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExtraCurriculumController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update an extra curriculum activity',
        description: 'Update extra curriculum activity details including name, fee, and description.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Extra curriculum activity ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Extra curriculum activity updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires admin privileges' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Extra curriculum activity not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, extra_curriculum_dto_1.UpdateExtraCurriculumDto]),
    __metadata("design:returntype", void 0)
], ExtraCurriculumController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete an extra curriculum activity',
        description: 'Delete an extra curriculum activity. Only available to super administrators.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Extra curriculum activity ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Extra curriculum activity deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires super admin privileges' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Extra curriculum activity not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExtraCurriculumController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/students/:studentId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Assign a student to an extra curriculum activity',
        description: 'Enroll a student in an extra curriculum activity. This will affect their total fee.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Extra curriculum activity ID' }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Student enrolled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires admin privileges' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Extra curriculum activity or student not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExtraCurriculumController.prototype, "assignStudent", null);
exports.ExtraCurriculumController = ExtraCurriculumController = __decorate([
    (0, swagger_1.ApiTags)('Extra Curriculum'),
    (0, common_1.Controller)('extra-curriculum'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [extra_curriculum_service_1.ExtraCurriculumService])
], ExtraCurriculumController);
//# sourceMappingURL=extra-curriculum.controller.js.map