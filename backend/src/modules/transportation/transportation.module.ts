import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportationService } from './transportation.service';
import { TransportationController } from './transportation.controller';
import { Bus } from '../../entities/transportation/bus.entity';
import { BusStop } from '../../entities/transportation/bus-stop.entity';
import { BusRoute } from '../../entities/transportation/bus-route.entity';
import { BusLocation } from '../../entities/transportation/bus-location.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bus, BusStop, BusRoute, BusLocation, User])],
  controllers: [TransportationController],
  providers: [TransportationService],
  exports: [TransportationService],
})
export class TransportationModule {}
