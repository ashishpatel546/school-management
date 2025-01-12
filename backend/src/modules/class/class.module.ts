import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { Class } from '../../entities/class.entity';
import { User } from '../../entities/user.entity';
import { PromotionHistory } from '../../entities/promotion-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, User, PromotionHistory])],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService],
})
export class ClassModule {}
