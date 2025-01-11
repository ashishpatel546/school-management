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
exports.SubjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subject_entity_1 = require("../../entities/subject.entity");
const class_entity_1 = require("../../entities/class.entity");
let SubjectService = class SubjectService {
    constructor(subjectRepository, classRepository) {
        this.subjectRepository = subjectRepository;
        this.classRepository = classRepository;
    }
    async create(createSubjectDto) {
        const { classIds, ...subjectData } = createSubjectDto;
        const subject = this.subjectRepository.create(subjectData);
        if (classIds && classIds.length > 0) {
            const classes = await this.classRepository.findByIds(classIds);
            subject.classes = classes;
        }
        return await this.subjectRepository.save(subject);
    }
    async findAll() {
        return await this.subjectRepository.find({
            relations: ['classes'],
        });
    }
    async findOne(id) {
        const subject = await this.subjectRepository.findOne({
            where: { id },
            relations: ['classes'],
        });
        if (!subject) {
            throw new common_1.NotFoundException(`Subject with ID ${id} not found`);
        }
        return subject;
    }
    async update(id, updateSubjectDto) {
        const subject = await this.findOne(id);
        Object.assign(subject, updateSubjectDto);
        return await this.subjectRepository.save(subject);
    }
    async remove(id) {
        const result = await this.subjectRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Subject with ID ${id} not found`);
        }
    }
    async assignToClass(subjectId, classId) {
        const subject = await this.findOne(subjectId);
        const classEntity = await this.classRepository.findOne({ where: { id: classId } });
        if (!classEntity) {
            throw new common_1.NotFoundException(`Class with ID ${classId} not found`);
        }
        subject.classes = [...(subject.classes || []), classEntity];
        return await this.subjectRepository.save(subject);
    }
};
exports.SubjectService = SubjectService;
exports.SubjectService = SubjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SubjectService);
//# sourceMappingURL=subject.service.js.map