import { ExamService } from './exam.service';
import { CreateExamDto, UpdateExamDto } from './dto/exam.dto';
export declare class ExamController {
    private readonly examService;
    constructor(examService: ExamService);
    create(createExamDto: CreateExamDto): Promise<import("../../entities/exam.entity").Exam>;
    findAll(): Promise<import("../../entities/exam.entity").Exam[]>;
    findOne(id: string): Promise<import("../../entities/exam.entity").Exam>;
    findByClass(classId: string): Promise<import("../../entities/exam.entity").Exam[]>;
    update(id: string, updateExamDto: UpdateExamDto): Promise<import("../../entities/exam.entity").Exam>;
    remove(id: string): Promise<void>;
}
