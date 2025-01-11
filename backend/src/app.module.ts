import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getTypeOrmConfig } from './config/typeorm.config';
import { FeatureService } from './modules/feature/feature.service';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './modules/class/class.module';
import { SubjectModule } from './modules/subject/subject.module';
import { ExamModule } from './modules/exam/exam.module';
import { FeeModule } from './modules/fee/fee.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AdminModule } from './modules/admin/admin.module';
import { ExtraCurriculumModule } from './modules/extra-curriculum/extra-curriculum.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { LibraryModule } from './modules/library/library.module';
import { TransportationModule } from './modules/transportation/transportation.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { BehaviorModule } from './modules/behavior/behavior.module';
import { ResourceBookingModule } from './modules/resource-booking/resource-booking.module';
import { AlumniModule } from './modules/alumni/alumni.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { CafeteriaModule } from './modules/cafeteria/cafeteria.module';
import { HealthModule } from './modules/health/health.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { FeatureModule } from './modules/feature/feature.module';
import { PdfModule } from './modules/pdf/pdf.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    ClassModule,
    SubjectModule,
    ExamModule,
    FeeModule,
    AttendanceModule,
    AdminModule,
    ExtraCurriculumModule,
    CommunicationModule,
    LibraryModule,
    TransportationModule,
    HomeworkModule,
    CalendarModule,
    BehaviorModule,
    ResourceBookingModule,
    AlumniModule,
    NewsletterModule,
    CafeteriaModule,
    HealthModule,
    ClubsModule,
    FeatureModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    const featureService = this.moduleRef.get(FeatureService);
    await featureService.initializeFeatures();
  }
}
