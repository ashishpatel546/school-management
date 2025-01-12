import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamResultService } from './exam-result.service';
import { ExamResultController } from './exam-result.controller';
import { ExamResult } from '../../entities/exam-result.entity';
import { Exam } from '../../entities/exam.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamResult, Exam, User])],
  controllers: [ExamResultController],
  providers: [ExamResultService],
  exports: [ExamResultService],
})
export class ExamResultModule {}
