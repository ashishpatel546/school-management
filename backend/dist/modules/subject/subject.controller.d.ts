import { SubjectService } from './subject.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
export declare class SubjectController {
    private readonly subjectService;
    constructor(subjectService: SubjectService);
    create(createSubjectDto: CreateSubjectDto): Promise<import("../../entities/subject.entity").Subject>;
    findAll(): Promise<import("../../entities/subject.entity").Subject[]>;
    findOne(id: string): Promise<import("../../entities/subject.entity").Subject>;
    update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<import("../../entities/subject.entity").Subject>;
    remove(id: string): Promise<void>;
    assignToClass(subjectId: string, classId: string): Promise<import("../../entities/subject.entity").Subject>;
}
