export declare class CreateExamDto {
    name: string;
    date: Date;
    description?: string;
    classId: string;
    subjectId: string;
}
export declare class UpdateExamDto {
    name?: string;
    date?: Date;
    description?: string;
}
