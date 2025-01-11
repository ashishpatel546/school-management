import { Repository } from 'typeorm';
import { Exam } from '../../entities/exam.entity';
import { Class } from '../../entities/class.entity';
import { Subject } from '../../entities/subject.entity';
import { CreateExamDto, UpdateExamDto } from './dto/exam.dto';
export declare class ExamService {
    private examRepository;
    private classRepository;
    private subjectRepository;
    constructor(examRepository: Repository<Exam>, classRepository: Repository<Class>, subjectRepository: Repository<Subject>);
    create(createExamDto: CreateExamDto): Promise<Exam>;
    findAll(): Promise<Exam[]>;
    findOne(id: string): Promise<Exam>;
    update(id: string, updateExamDto: UpdateExamDto): Promise<Exam>;
    remove(id: string): Promise<void>;
    findByClass(classId: string): Promise<Exam[]>;
}
