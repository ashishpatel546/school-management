import { User } from './user.entity';
import { Class } from './class.entity';
export declare enum FeeStatus {
    PENDING = "pending",
    PAID = "paid",
    OVERDUE = "overdue"
}
export declare class Fee {
    id: string;
    student: User;
    class: Class;
    studentId: string;
    classId: string;
    amount: number;
    extraCurriculumFee: number;
    totalAmount: number;
    status: FeeStatus;
    dueDate: Date;
    paidDate: Date;
    createdAt: Date;
}
