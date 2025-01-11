import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fee, FeeStatus } from '../../entities/fee.entity';
import { User } from '../../entities/user.entity';
import { Class } from '../../entities/class.entity';
import { CreateFeeDto, UpdateFeeDto, PayFeeDto } from './dto/fee.dto';

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(Fee)
    private feeRepository: Repository<Fee>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createFeeDto: CreateFeeDto): Promise<Fee> {
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
      throw new NotFoundException(`Student with ID ${createFeeDto.studentId} not found`);
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: createFeeDto.classId },
    });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${createFeeDto.classId} not found`);
    }

    try {
      console.log('Starting fee creation process...');
      console.log('Student data:', {
        id: student.id,
        extraCurriculums: student.extraCurriculums?.map(ec => ({ id: ec.id, fee: ec.fee }))
      });

      const totalExtraCurriculumFee = student.extraCurriculums?.reduce(
        (sum, ec) => {
          console.log(`Processing extra curriculum fee: ${ec.fee}`);
          return sum + Number(ec.fee);
        },
        0
      ) || 0;

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
        status: FeeStatus.PENDING
      };

      console.log('Prepared fee data:', JSON.stringify(feeData, null, 2));
      
      // Validate required fields
      if (!feeData.studentId || !feeData.classId || !feeData.amount || !feeData.dueDate) {
        throw new BadRequestException('Missing required fields');
      }

      // Create and save the fee entity
      console.log('Creating fee entity...');
      const fee = this.feeRepository.create(feeData);
      console.log('Created fee entity:', fee);
      
      console.log('Saving fee to database...');
      const savedFee = await this.feeRepository.save(fee);
      console.log('Fee saved successfully:', savedFee);
      return savedFee;
    } catch (error) {
      console.error('Error creating fee:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        detail: error.detail
      });
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      // Log the full error object for debugging
      console.error('Full error object:', error);
      
      throw new BadRequestException(`Failed to create fee: ${error.message}`);
    }
  }

  async findAll(): Promise<Fee[]> {
    return await this.feeRepository.find({
      relations: ['student', 'class'],
    });
  }

  async findOne(id: string): Promise<Fee> {
    const fee = await this.feeRepository.findOne({
      where: { id },
      relations: ['student', 'class'],
    });
    if (!fee) {
      throw new NotFoundException(`Fee with ID ${id} not found`);
    }
    return fee;
  }

  async update(id: string, updateFeeDto: UpdateFeeDto): Promise<Fee> {
    const fee = await this.findOne(id);
    Object.assign(fee, updateFeeDto);
    
    if (updateFeeDto.amount || updateFeeDto.extraCurriculumFee) {
      fee.totalAmount = (updateFeeDto.amount || fee.amount) + 
                       (updateFeeDto.extraCurriculumFee || fee.extraCurriculumFee);
    }

    return await this.feeRepository.save(fee);
  }

  async remove(id: string): Promise<void> {
    const result = await this.feeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fee with ID ${id} not found`);
    }
  }

  async payFee(id: string, payFeeDto: PayFeeDto): Promise<Fee> {
    const fee = await this.findOne(id);
    
    if (fee.status === FeeStatus.PAID) {
      throw new BadRequestException('Fee has already been paid');
    }

    if (payFeeDto.amount !== fee.totalAmount) {
      throw new BadRequestException('Payment amount must match the total fee amount');
    }

    fee.status = FeeStatus.PAID;
    fee.paidDate = new Date();

    return await this.feeRepository.save(fee);
  }

  async findByStudent(studentId: string): Promise<Fee[]> {
    return await this.feeRepository.find({
      where: { student: { id: studentId } },
      relations: ['student', 'class'],
    });
  }

  async updateFeeOnExtraCurriculumChange(studentId: string): Promise<void> {
    const fees = await this.findByStudent(studentId);
    const student = await this.userRepository.findOne({
      where: { id: studentId },
      relations: ['extraCurriculums'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const totalExtraCurriculumFee = student.extraCurriculums?.reduce(
      (sum, ec) => sum + ec.fee,
      0
    ) || 0;

    for (const fee of fees) {
      if (fee.status === FeeStatus.PENDING) {
        await this.update(fee.id, {
          extraCurriculumFee: totalExtraCurriculumFee,
        });
      }
    }
  }
}
