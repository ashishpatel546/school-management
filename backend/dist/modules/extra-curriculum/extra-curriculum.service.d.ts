import { Repository } from 'typeorm';
import { ExtraCurriculum } from '../../entities/extra-curriculum.entity';
import { CreateExtraCurriculumDto, UpdateExtraCurriculumDto } from './dto/extra-curriculum.dto';
export declare class ExtraCurriculumService {
    private extraCurriculumRepository;
    constructor(extraCurriculumRepository: Repository<ExtraCurriculum>);
    create(createDto: CreateExtraCurriculumDto): Promise<ExtraCurriculum>;
    findAll(): Promise<ExtraCurriculum[]>;
    findOne(id: string): Promise<ExtraCurriculum>;
    update(id: string, updateDto: UpdateExtraCurriculumDto): Promise<ExtraCurriculum>;
    remove(id: string): Promise<void>;
    assignStudent(id: string, studentId: string): Promise<ExtraCurriculum>;
}
