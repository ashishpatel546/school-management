import { Repository } from 'typeorm';
import { Fee } from '../../entities/fee.entity';
import { User } from '../../entities/user.entity';
import { Class } from '../../entities/class.entity';
import { CreateFeeDto, UpdateFeeDto, PayFeeDto } from './dto/fee.dto';
export declare class FeeService {
    private feeRepository;
    private userRepository;
    private classRepository;
    constructor(feeRepository: Repository<Fee>, userRepository: Repository<User>, classRepository: Repository<Class>);
    create(createFeeDto: CreateFeeDto): Promise<Fee>;
    findAll(): Promise<Fee[]>;
    findOne(id: string): Promise<Fee>;
    update(id: string, updateFeeDto: UpdateFeeDto): Promise<Fee>;
    remove(id: string): Promise<void>;
    payFee(id: string, payFeeDto: PayFeeDto): Promise<Fee>;
    findByStudent(studentId: string): Promise<Fee[]>;
    updateFeeOnExtraCurriculumChange(studentId: string): Promise<void>;
}
