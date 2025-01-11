import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BehaviorService } from './behavior.service';
import { BehaviorController } from './behavior.controller';
import { DisciplineRecord } from '../../entities/behavior/discipline-record.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DisciplineRecord, User])],
  controllers: [BehaviorController],
  providers: [BehaviorService],
  exports: [BehaviorService],
})
export class BehaviorModule {}
