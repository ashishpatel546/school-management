import { Repository } from 'typeorm';
import { Subject } from '../../entities/subject.entity';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { Class } from '../../entities/class.entity';
export declare class SubjectService {
    private subjectRepository;
    private classRepository;
    constructor(subjectRepository: Repository<Subject>, classRepository: Repository<Class>);
    create(createSubjectDto: CreateSubjectDto): Promise<Subject>;
    findAll(): Promise<Subject[]>;
    findOne(id: string): Promise<Subject>;
    update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject>;
    remove(id: string): Promise<void>;
    assignToClass(subjectId: string, classId: string): Promise<Subject>;
}
