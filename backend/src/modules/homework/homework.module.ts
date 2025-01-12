import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { Assignment } from '../../entities/homework/assignment.entity';
import { AssignmentSubmission } from '../../entities/homework/assignment-submission.entity';
import { User } from '../../entities/user.entity';
import { Class } from '../../entities/class.entity';
import { Subject } from '../../entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, AssignmentSubmission, User, Class, Subject])],
  controllers: [HomeworkController],
  providers: [HomeworkService],
  exports: [HomeworkService],
})
export class HomeworkModule {}
