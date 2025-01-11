"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtraCurriculumModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const extra_curriculum_service_1 = require("./extra-curriculum.service");
const extra_curriculum_controller_1 = require("./extra-curriculum.controller");
const extra_curriculum_entity_1 = require("../../entities/extra-curriculum.entity");
let ExtraCurriculumModule = class ExtraCurriculumModule {
};
exports.ExtraCurriculumModule = ExtraCurriculumModule;
exports.ExtraCurriculumModule = ExtraCurriculumModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([extra_curriculum_entity_1.ExtraCurriculum])],
        controllers: [extra_curriculum_controller_1.ExtraCurriculumController],
        providers: [extra_curriculum_service_1.ExtraCurriculumService],
        exports: [extra_curriculum_service_1.ExtraCurriculumService],
    })
], ExtraCurriculumModule);
//# sourceMappingURL=extra-curriculum.module.js.map