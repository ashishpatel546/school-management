import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceBookingService } from './resource-booking.service';
import { ResourceBookingController } from './resource-booking.controller';
import { Resource } from '../../entities/resource-booking/resource.entity';
import { ResourceBooking } from '../../entities/resource-booking/resource-booking.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resource, ResourceBooking, User])],
  controllers: [ResourceBookingController],
  providers: [ResourceBookingService],
  exports: [ResourceBookingService],
})
export class ResourceBookingModule {}
