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
exports.ExtraCurriculumService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const extra_curriculum_entity_1 = require("../../entities/extra-curriculum.entity");
let ExtraCurriculumService = class ExtraCurriculumService {
    constructor(extraCurriculumRepository) {
        this.extraCurriculumRepository = extraCurriculumRepository;
    }
    async create(createDto) {
        const extraCurriculum = this.extraCurriculumRepository.create(createDto);
        return await this.extraCurriculumRepository.save(extraCurriculum);
    }
    async findAll() {
        return await this.extraCurriculumRepository.find({
            relations: ['students'],
        });
    }
    async findOne(id) {
        const extraCurriculum = await this.extraCurriculumRepository.findOne({
            where: { id },
            relations: ['students'],
        });
        if (!extraCurriculum) {
            throw new common_1.NotFoundException(`Extra curriculum with ID ${id} not found`);
        }
        return extraCurriculum;
    }
    async update(id, updateDto) {
        const extraCurriculum = await this.findOne(id);
        Object.assign(extraCurriculum, updateDto);
        return await this.extraCurriculumRepository.save(extraCurriculum);
    }
    async remove(id) {
        const result = await this.extraCurriculumRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Extra curriculum with ID ${id} not found`);
        }
    }
    async assignStudent(id, studentId) {
        const extraCurriculum = await this.findOne(id);
        extraCurriculum.students = [...(extraCurriculum.students || []), { id: studentId }];
        return await this.extraCurriculumRepository.save(extraCurriculum);
    }
};
exports.ExtraCurriculumService = ExtraCurriculumService;
exports.ExtraCurriculumService = ExtraCurriculumService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(extra_curriculum_entity_1.ExtraCurriculum)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExtraCurriculumService);
//# sourceMappingURL=extra-curriculum.service.js.map