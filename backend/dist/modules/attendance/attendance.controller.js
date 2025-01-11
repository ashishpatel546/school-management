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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attendance_service_1 = require("./attendance.service");
const attendance_dto_1 = require("./dto/attendance.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_entity_1 = require("../../entities/user.entity");
const user_decorator_1 = require("../../auth/decorators/user.decorator");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    create(createAttendanceDto, teacherId) {
        return this.attendanceService.create(createAttendanceDto, teacherId);
    }
    bulkCreate(bulkCreateDto, teacherId) {
        return this.attendanceService.bulkCreate(bulkCreateDto, teacherId);
    }
    findAll() {
        return this.attendanceService.findAll();
    }
    findOne(id) {
        return this.attendanceService.findOne(id);
    }
    findByClass(classId, date) {
        return this.attendanceService.findByClass(classId, date);
    }
    findByStudent(studentId) {
        return this.attendanceService.findByStudent(studentId);
    }
    update(id, updateAttendanceDto) {
        return this.attendanceService.update(id, updateAttendanceDto);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark attendance for a student',
        description: 'Teachers can mark attendance for individual students in their class.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attendance marked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only teachers can mark attendance' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student or class not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.CreateAttendanceDto, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark attendance for multiple students',
        description: 'Teachers can mark attendance for multiple students in a class at once.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Bulk attendance marked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only teachers can mark attendance' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Class not found' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.BulkCreateAttendanceDto, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all attendance records',
        description: 'Retrieve all attendance records. Available to administrators and teachers.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all attendance records' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Insufficient privileges' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get attendance by id',
        description: 'Retrieve a specific attendance record by its ID.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attendance record ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance record found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attendance record not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get attendance by class',
        description: 'Retrieve attendance records for a specific class on a given date.'
    }),
    (0, swagger_1.ApiParam)({ name: 'classId', description: 'Class ID' }),
    (0, swagger_1.ApiQuery)({ name: 'date', description: 'Date to fetch attendance for', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of attendance records for the class' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Insufficient privileges' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Class not found' }),
    __param(0, (0, common_1.Param)('classId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findByClass", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get attendance by student',
        description: 'Retrieve all attendance records for a specific student.'
    }),
    (0, swagger_1.ApiParam)({ name: 'studentId', description: 'Student ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of student attendance records' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Student not found' }),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({
        summary: 'Update attendance',
        description: 'Update an existing attendance record. Only available to teachers.'
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attendance record ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance record updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only teachers can update attendance' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attendance record not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attendance_dto_1.UpdateAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "update", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('Attendance'),
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map