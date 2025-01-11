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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("../../entities/attendance.entity");
const user_entity_1 = require("../../entities/user.entity");
const class_entity_1 = require("../../entities/class.entity");
let AttendanceService = class AttendanceService {
    constructor(attendanceRepository, userRepository, classRepository) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
        this.classRepository = classRepository;
    }
    async create(createAttendanceDto, teacherId) {
        const student = await this.userRepository.findOne({
            where: { id: createAttendanceDto.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${createAttendanceDto.studentId} not found`);
        }
        const classEntity = await this.classRepository.findOne({
            where: { id: createAttendanceDto.classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException(`Class with ID ${createAttendanceDto.classId} not found`);
        }
        const teacher = await this.userRepository.findOne({
            where: { id: teacherId },
        });
        if (!teacher) {
            throw new common_1.NotFoundException(`Teacher with ID ${teacherId} not found`);
        }
        const attendance = this.attendanceRepository.create({
            ...createAttendanceDto,
            student,
            class: classEntity,
            markedBy: teacher,
        });
        return await this.attendanceRepository.save(attendance);
    }
    async bulkCreate(bulkCreateDto, teacherId) {
        const classEntity = await this.classRepository.findOne({
            where: { id: bulkCreateDto.classId },
            relations: ['students'],
        });
        if (!classEntity) {
            throw new common_1.NotFoundException(`Class with ID ${bulkCreateDto.classId} not found`);
        }
        const teacher = await this.userRepository.findOne({
            where: { id: teacherId },
        });
        if (!teacher) {
            throw new common_1.NotFoundException(`Teacher with ID ${teacherId} not found`);
        }
        const attendances = classEntity.students.map(student => {
            return this.attendanceRepository.create({
                student,
                class: classEntity,
                date: bulkCreateDto.date,
                present: bulkCreateDto.presentStudentIds.includes(student.id),
                markedBy: teacher,
            });
        });
        return await this.attendanceRepository.save(attendances);
    }
    async findAll() {
        return await this.attendanceRepository.find({
            relations: ['student', 'class', 'markedBy'],
        });
    }
    async findOne(id) {
        const attendance = await this.attendanceRepository.findOne({
            where: { id },
            relations: ['student', 'class', 'markedBy'],
        });
        if (!attendance) {
            throw new common_1.NotFoundException(`Attendance with ID ${id} not found`);
        }
        return attendance;
    }
    async update(id, updateAttendanceDto) {
        const attendance = await this.findOne(id);
        Object.assign(attendance, updateAttendanceDto);
        return await this.attendanceRepository.save(attendance);
    }
    async findByClass(classId, date) {
        return await this.attendanceRepository.find({
            where: {
                class: { id: classId },
                date,
            },
            relations: ['student', 'class', 'markedBy'],
        });
    }
    async findByStudent(studentId) {
        return await this.attendanceRepository.find({
            where: {
                student: { id: studentId },
            },
            relations: ['student', 'class', 'markedBy'],
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map