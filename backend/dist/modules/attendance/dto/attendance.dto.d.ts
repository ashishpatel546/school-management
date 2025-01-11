export declare class CreateAttendanceDto {
    studentId: string;
    classId: string;
    date: Date;
    present: boolean;
}
export declare class UpdateAttendanceDto {
    present: boolean;
}
export declare class BulkCreateAttendanceDto {
    classId: string;
    date: Date;
    presentStudentIds: string[];
}
