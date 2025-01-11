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
exports.FeeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fee_service_1 = require("./fee.service");
const fee_dto_1 = require("./dto/fee.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_entity_1 = require("../../entities/user.entity");
let FeeController = class FeeController {
    constructor(feeService) {
        this.feeService = feeService;
    }
    create(createFeeDto) {
        return this.feeService.create(createFeeDto);
    }
    findAll() {
        return this.feeService.findAll();
    }
    findOne(id) {
        return this.feeService.findOne(id);
    }
    findByStudent(studentId) {
        return this.feeService.findByStudent(studentId);
    }
    update(id, updateFeeDto) {
        return this.feeService.update(id, updateFeeDto);
    }
    payFee(id, payFeeDto) {
        return this.feeService.payFee(id, payFeeDto);
    }
    remove(id) {
        return this.feeService.remove(id);
    }
};
exports.FeeController = FeeController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new fee',
        description: 'Create a new fee record for a student, including base fee and extra curriculum fees.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Fee record created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires admin privileges' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fee_dto_1.CreateFeeDto]),
    __metadata("design:returntype", void 0)
], FeeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all fees',
        description: 'Retrieve all fee records. Available only to administrators.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all fee records' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires admin privileges' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a fee by id',
        description: 'Retrieve detailed information about a specific fee record.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fee record found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fee record not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all fees for a student',
        description: 'Retrieve all fee records associated with a specific student.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of student fee records' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeeController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a fee',
        description: 'Update fee details including amount, due date, and status.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fee record updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires admin privileges' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fee record not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fee_dto_1.UpdateFeeDto]),
    __metadata("design:returntype", void 0)
], FeeController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/pay'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.PARENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Pay a fee',
        description: 'Process fee payment for a student. Only available to parents.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid payment amount' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only parents can make payments' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fee record not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fee_dto_1.PayFeeDto]),
    __metadata("design:returntype", void 0)
], FeeController.prototype, "payFee", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a fee',
        description: 'Delete a fee record. Only available to super administrators.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fee record deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Requires super admin privileges' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Fee record not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeeController.prototype, "remove", null);
exports.FeeController = FeeController = __decorate([
    (0, swagger_1.ApiTags)('Fees'),
    (0, common_1.Controller)('fees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [fee_service_1.FeeService])
], FeeController);
//# sourceMappingURL=fee.controller.js.map