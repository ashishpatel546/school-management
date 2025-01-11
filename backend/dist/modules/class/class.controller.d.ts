import { ClassService } from './class.service';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
export declare class ClassController {
    private readonly classService;
    constructor(classService: ClassService);
    create(createClassDto: CreateClassDto): Promise<import("../../entities/class.entity").Class>;
    findAll(): Promise<import("../../entities/class.entity").Class[]>;
    findOne(id: string): Promise<import("../../entities/class.entity").Class>;
    update(id: string, updateClassDto: UpdateClassDto): Promise<import("../../entities/class.entity").Class>;
    remove(id: string): Promise<void>;
    assignTeacher(classId: string, teacherId: string): Promise<import("../../entities/class.entity").Class>;
    assignStudent(classId: string, studentId: string): Promise<import("../../entities/class.entity").Class>;
}
