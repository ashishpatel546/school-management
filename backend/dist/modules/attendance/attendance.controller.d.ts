import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto, BulkCreateAttendanceDto } from './dto/attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(createAttendanceDto: CreateAttendanceDto, teacherId: string): Promise<import("../../entities/attendance.entity").Attendance>;
    bulkCreate(bulkCreateDto: BulkCreateAttendanceDto, teacherId: string): Promise<import("../../entities/attendance.entity").Attendance[]>;
    findAll(): Promise<import("../../entities/attendance.entity").Attendance[]>;
    findOne(id: string): Promise<import("../../entities/attendance.entity").Attendance>;
    findByClass(classId: string, date: Date): Promise<import("../../entities/attendance.entity").Attendance[]>;
    findByStudent(studentId: string): Promise<import("../../entities/attendance.entity").Attendance[]>;
    update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<import("../../entities/attendance.entity").Attendance>;
}
