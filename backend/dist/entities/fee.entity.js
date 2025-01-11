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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fee = exports.FeeStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const class_entity_1 = require("./class.entity");
var FeeStatus;
(function (FeeStatus) {
    FeeStatus["PENDING"] = "pending";
    FeeStatus["PAID"] = "paid";
    FeeStatus["OVERDUE"] = "overdue";
})(FeeStatus || (exports.FeeStatus = FeeStatus = {}));
let Fee = class Fee {
};
exports.Fee = Fee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Fee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'studentId', referencedColumnName: 'id' }),
    __metadata("design:type", user_entity_1.User)
], Fee.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'classId', referencedColumnName: 'id' }),
    __metadata("design:type", class_entity_1.Class)
], Fee.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'studentId' }),
    __metadata("design:type", String)
], Fee.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'classId' }),
    __metadata("design:type", String)
], Fee.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Fee.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Fee.prototype, "extraCurriculumFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Fee.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: FeeStatus.PENDING }),
    __metadata("design:type", String)
], Fee.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Fee.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Fee.prototype, "paidDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Fee.prototype, "createdAt", void 0);
exports.Fee = Fee = __decorate([
    (0, typeorm_1.Entity)('fees')
], Fee);
//# sourceMappingURL=fee.entity.js.map