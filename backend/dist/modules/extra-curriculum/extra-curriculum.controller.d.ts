import { ExtraCurriculumService } from './extra-curriculum.service';
import { CreateExtraCurriculumDto, UpdateExtraCurriculumDto } from './dto/extra-curriculum.dto';
export declare class ExtraCurriculumController {
    private readonly extraCurriculumService;
    constructor(extraCurriculumService: ExtraCurriculumService);
    create(createDto: CreateExtraCurriculumDto): Promise<import("../../entities/extra-curriculum.entity").ExtraCurriculum>;
    findAll(): Promise<import("../../entities/extra-curriculum.entity").ExtraCurriculum[]>;
    findOne(id: string): Promise<import("../../entities/extra-curriculum.entity").ExtraCurriculum>;
    update(id: string, updateDto: UpdateExtraCurriculumDto): Promise<import("../../entities/extra-curriculum.entity").ExtraCurriculum>;
    remove(id: string): Promise<void>;
    assignStudent(id: string, studentId: string): Promise<import("../../entities/extra-curriculum.entity").ExtraCurriculum>;
}
