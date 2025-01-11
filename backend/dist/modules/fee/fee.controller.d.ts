import { FeeService } from './fee.service';
import { CreateFeeDto, UpdateFeeDto, PayFeeDto } from './dto/fee.dto';
export declare class FeeController {
    private readonly feeService;
    constructor(feeService: FeeService);
    create(createFeeDto: CreateFeeDto): Promise<import("../../entities/fee.entity").Fee>;
    findAll(): Promise<import("../../entities/fee.entity").Fee[]>;
    findOne(id: string): Promise<import("../../entities/fee.entity").Fee>;
    findByStudent(studentId: string): Promise<import("../../entities/fee.entity").Fee[]>;
    update(id: string, updateFeeDto: UpdateFeeDto): Promise<import("../../entities/fee.entity").Fee>;
    payFee(id: string, payFeeDto: PayFeeDto): Promise<import("../../entities/fee.entity").Fee>;
    remove(id: string): Promise<void>;
}
