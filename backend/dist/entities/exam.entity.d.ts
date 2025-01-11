import { Class } from './class.entity';
import { Subject } from './subject.entity';
export declare class Exam {
    id: string;
    name: string;
    date: Date;
    description: string;
    class: Class;
    subject: Subject;
    createdAt: Date;
}
