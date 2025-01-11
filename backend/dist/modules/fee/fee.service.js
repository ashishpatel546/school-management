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
exports.FeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fee_entity_1 = require("../../entities/fee.entity");
const user_entity_1 = require("../../entities/user.entity");
const class_entity_1 = require("../../entities/class.entity");
let FeeService = class FeeService {
    constructor(feeRepository, userRepository, classRepository) {
        this.feeRepository = feeRepository;
        this.userRepository = userRepository;
        this.classRepository = classRepository;
    }
    async create(createFeeDto) {
        const student = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.extraCurriculums', 'extraCurriculums')
            .where('user.id = :id', { id: createFeeDto.studentId })
            .getOne();
        console.log('Loaded student with extra curriculums:', {
            studentId: student?.id,
            extraCurriculums: student?.extraCurriculums?.map(ec => ({
                id: ec.id,
                name: ec.name,
                fee: ec.fee
            }))
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${createFeeDto.studentId} not found`);
        }
        const classEntity = await this.classRepository.findOne({
            where: { id: createFeeDto.classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException(`Class with ID ${createFeeDto.classId} not found`);
        }
        try {
            console.log('Starting fee creation process...');
            console.log('Student data:', {
                id: student.id,
                extraCurriculums: student.extraCurriculums?.map(ec => ({ id: ec.id, fee: ec.fee }))
            });
            const totalExtraCurriculumFee = student.extraCurriculums?.reduce((sum, ec) => {
                console.log(`Processing extra curriculum fee: ${ec.fee}`);
                return sum + Number(ec.fee);
            }, 0) || 0;
            console.log('Calculated total extra curriculum fee:', totalExtraCurriculumFee);
            const feeData = {
                student,
                class: classEntity,
                studentId: student.id,
                classId: classEntity.id,
                amount: Number(createFeeDto.amount),
                extraCurriculumFee: Number(totalExtraCurriculumFee),
                totalAmount: Number(createFeeDto.amount) + Number(totalExtraCurriculumFee),
                dueDate: new Date(createFeeDto.dueDate),
                status: fee_entity_1.FeeStatus.PENDING
            };
            console.log('Prepared fee data:', JSON.stringify(feeData, null, 2));
            if (!feeData.studentId || !feeData.classId || !feeData.amount || !feeData.dueDate) {
                throw new common_1.BadRequestException('Missing required fields');
            }
            console.log('Creating fee entity...');
            const fee = this.feeRepository.create(feeData);
            console.log('Created fee entity:', fee);
            console.log('Saving fee to database...');
            const savedFee = await this.feeRepository.save(fee);
            console.log('Fee saved successfully:', savedFee);
            return savedFee;
        }
        catch (error) {
            console.error('Error creating fee:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
                code: error.code,
                detail: error.detail
            });
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Full error object:', error);
            throw new common_1.BadRequestException(`Failed to create fee: ${error.message}`);
        }
    }
    async findAll() {
        return await this.feeRepository.find({
            relations: ['student', 'class'],
        });
    }
    async findOne(id) {
        const fee = await this.feeRepository.findOne({
            where: { id },
            relations: ['student', 'class'],
        });
        if (!fee) {
            throw new common_1.NotFoundException(`Fee with ID ${id} not found`);
        }
        return fee;
    }
    async update(id, updateFeeDto) {
        const fee = await this.findOne(id);
        Object.assign(fee, updateFeeDto);
        if (updateFeeDto.amount || updateFeeDto.extraCurriculumFee) {
            fee.totalAmount = (updateFeeDto.amount || fee.amount) +
                (updateFeeDto.extraCurriculumFee || fee.extraCurriculumFee);
        }
        return await this.feeRepository.save(fee);
    }
    async remove(id) {
        const result = await this.feeRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Fee with ID ${id} not found`);
        }
    }
    async payFee(id, payFeeDto) {
        const fee = await this.findOne(id);
        if (fee.status === fee_entity_1.FeeStatus.PAID) {
            throw new common_1.BadRequestException('Fee has already been paid');
        }
        if (payFeeDto.amount !== fee.totalAmount) {
            throw new common_1.BadRequestException('Payment amount must match the total fee amount');
        }
        fee.status = fee_entity_1.FeeStatus.PAID;
        fee.paidDate = new Date();
        return await this.feeRepository.save(fee);
    }
    async findByStudent(studentId) {
        return await this.feeRepository.find({
            where: { student: { id: studentId } },
            relations: ['student', 'class'],
        });
    }
    async updateFeeOnExtraCurriculumChange(studentId) {
        const fees = await this.findByStudent(studentId);
        const student = await this.userRepository.findOne({
            where: { id: studentId },
            relations: ['extraCurriculums'],
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${studentId} not found`);
        }
        const totalExtraCurriculumFee = student.extraCurriculums?.reduce((sum, ec) => sum + ec.fee, 0) || 0;
        for (const fee of fees) {
            if (fee.status === fee_entity_1.FeeStatus.PENDING) {
                await this.update(fee.id, {
                    extraCurriculumFee: totalExtraCurriculumFee,
                });
            }
        }
    }
};
exports.FeeService = FeeService;
exports.FeeService = FeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fee_entity_1.Fee)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FeeService);
//# sourceMappingURL=fee.service.js.map