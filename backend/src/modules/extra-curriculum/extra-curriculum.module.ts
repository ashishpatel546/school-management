import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraCurriculumService } from './extra-curriculum.service';
import { ExtraCurriculumController } from './extra-curriculum.controller';
import { ExtraCurriculum } from '../../entities/extra-curriculum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExtraCurriculum])],
  controllers: [ExtraCurriculumController],
  providers: [ExtraCurriculumService],
  exports: [ExtraCurriculumService],
})
export class ExtraCurriculumModule {}
