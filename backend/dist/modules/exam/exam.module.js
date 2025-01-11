"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const exam_service_1 = require("./exam.service");
const exam_controller_1 = require("./exam.controller");
const exam_entity_1 = require("../../entities/exam.entity");
const class_entity_1 = require("../../entities/class.entity");
const subject_entity_1 = require("../../entities/subject.entity");
let ExamModule = class ExamModule {
};
exports.ExamModule = ExamModule;
exports.ExamModule = ExamModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([exam_entity_1.Exam, class_entity_1.Class, subject_entity_1.Subject])],
        controllers: [exam_controller_1.ExamController],
        providers: [exam_service_1.ExamService],
        exports: [exam_service_1.ExamService],
    })
], ExamModule);
//# sourceMappingURL=exam.module.js.map