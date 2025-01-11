import { Repository } from 'typeorm';
import { Attendance } from '../../entities/attendance.entity';
import { User } from '../../entities/user.entity';
import { Class } from '../../entities/class.entity';
import { CreateAttendanceDto, UpdateAttendanceDto, BulkCreateAttendanceDto } from './dto/attendance.dto';
export declare class AttendanceService {
    private attendanceRepository;
    private userRepository;
    private classRepository;
    constructor(attendanceRepository: Repository<Attendance>, userRepository: Repository<User>, classRepository: Repository<Class>);
    create(createAttendanceDto: CreateAttendanceDto, teacherId: string): Promise<Attendance>;
    bulkCreate(bulkCreateDto: BulkCreateAttendanceDto, teacherId: string): Promise<Attendance[]>;
    findAll(): Promise<Attendance[]>;
    findOne(id: string): Promise<Attendance>;
    update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance>;
    findByClass(classId: string, date: Date): Promise<Attendance[]>;
    findByStudent(studentId: string): Promise<Attendance[]>;
}
