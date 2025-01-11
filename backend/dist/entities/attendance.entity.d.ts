import { User } from './user.entity';
import { Class } from './class.entity';
export declare class Attendance {
    id: string;
    student: User;
    class: Class;
    date: Date;
    present: boolean;
    markedBy: User;
    createdAt: Date;
}
