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
exports.ClassService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_entity_1 = require("../../entities/class.entity");
let ClassService = class ClassService {
    constructor(classRepository) {
        this.classRepository = classRepository;
    }
    async create(createClassDto) {
        const newClass = this.classRepository.create(createClassDto);
        return await this.classRepository.save(newClass);
    }
    async findAll() {
        return await this.classRepository.find({
            relations: ['teachers', 'students'],
        });
    }
    async findOne(id) {
        const classEntity = await this.classRepository.findOne({
            where: { id },
            relations: ['teachers', 'students'],
        });
        if (!classEntity) {
            throw new common_1.NotFoundException(`Class with ID ${id} not found`);
        }
        return classEntity;
    }
    async update(id, updateClassDto) {
        const classEntity = await this.findOne(id);
        Object.assign(classEntity, updateClassDto);
        return await this.classRepository.save(classEntity);
    }
    async remove(id) {
        const result = await this.classRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Class with ID ${id} not found`);
        }
    }
    async assignTeacher(classId, teacherId) {
        const classEntity = await this.findOne(classId);
        classEntity.teachers = [...(classEntity.teachers || []), { id: teacherId }];
        return await this.classRepository.save(classEntity);
    }
    async assignStudent(classId, studentId) {
        const classEntity = await this.findOne(classId);
        classEntity.students = [...(classEntity.students || []), { id: studentId }];
        return await this.classRepository.save(classEntity);
    }
};
exports.ClassService = ClassService;
exports.ClassService = ClassService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClassService);
//# sourceMappingURL=class.service.js.map