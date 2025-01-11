import { FeeStatus } from '../../../entities/fee.entity';
export declare class CreateFeeDto {
    studentId: string;
    classId: string;
    amount: number;
    extraCurriculumFee?: number;
    dueDate: string;
    status?: FeeStatus;
}
export declare class UpdateFeeDto {
    amount?: number;
    extraCurriculumFee?: number;
    dueDate?: Date;
    status?: FeeStatus;
}
export declare class PayFeeDto {
    amount: number;
}
