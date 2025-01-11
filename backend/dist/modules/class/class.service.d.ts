import { Repository } from 'typeorm';
import { Class } from '../../entities/class.entity';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
export declare class ClassService {
    private classRepository;
    constructor(classRepository: Repository<Class>);
    create(createClassDto: CreateClassDto): Promise<Class>;
    findAll(): Promise<Class[]>;
    findOne(id: string): Promise<Class>;
    update(id: string, updateClassDto: UpdateClassDto): Promise<Class>;
    remove(id: string): Promise<void>;
    assignTeacher(classId: string, teacherId: string): Promise<Class>;
    assignStudent(classId: string, studentId: string): Promise<Class>;
}
