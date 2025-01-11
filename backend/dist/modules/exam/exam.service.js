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
exports.ExamService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exam_entity_1 = require("../../entities/exam.entity");
const class_entity_1 = require("../../entities/class.entity");
const subject_entity_1 = require("../../entities/subject.entity");
let ExamService = class ExamService {
    constructor(examRepository, classRepository, subjectRepository) {
        this.examRepository = examRepository;
        this.classRepository = classRepository;
        this.subjectRepository = subjectRepository;
    }
    async create(createExamDto) {
        const classEntity = await this.classRepository.findOne({
            where: { id: createExamDto.classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException(`Class with ID ${createExamDto.classId} not found`);
        }
        const subject = await this.subjectRepository.findOne({
            where: { id: createExamDto.subjectId },
        });
        if (!subject) {
            throw new common_1.NotFoundException(`Subject with ID ${createExamDto.subjectId} not found`);
        }
        const exam = this.examRepository.create({
            name: createExamDto.name,
            date: createExamDto.date,
            description: createExamDto.description,
            class: classEntity,
            subject: subject,
        });
        return await this.examRepository.save(exam);
    }
    async findAll() {
        return await this.examRepository.find({
            relations: ['class', 'subject'],
        });
    }
    async findOne(id) {
        const exam = await this.examRepository.findOne({
            where: { id },
            relations: ['class', 'subject'],
        });
        if (!exam) {
            throw new common_1.NotFoundException(`Exam with ID ${id} not found`);
        }
        return exam;
    }
    async update(id, updateExamDto) {
        const exam = await this.findOne(id);
        Object.assign(exam, updateExamDto);
        return await this.examRepository.save(exam);
    }
    async remove(id) {
        const result = await this.examRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Exam with ID ${id} not found`);
        }
    }
    async findByClass(classId) {
        return await this.examRepository.find({
            where: { class: { id: classId } },
            relations: ['class', 'subject'],
        });
    }
};
exports.ExamService = ExamService;
exports.ExamService = ExamService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exam_entity_1.Exam)),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(2, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ExamService);
//# sourceMappingURL=exam.service.js.map