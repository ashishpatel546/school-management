import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../../auth/decorators/user.decorator';
import { BehaviorService } from './behavior.service';
import { CreateDisciplineRecordDto, ResolveDisciplineRecordDto, UpdateDisciplineRecordDto } from './dto/behavior.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Behavior')
@Controller('behavior')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BehaviorController {
  constructor(private readonly behaviorService: BehaviorService) {}

  @Post()
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a discipline record' })
  create(@Body() createDto: CreateDisciplineRecordDto, @User('id') issuerId: string) {
    return this.behaviorService.create(issuerId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discipline records' })
  findAll() {
    return this.behaviorService.findAll();
  }

  @Get('unresolved')
  @ApiOperation({ summary: 'Get all unresolved discipline records' })
  findUnresolved() {
    return this.behaviorService.findUnresolved();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a discipline record by id' })
  findOne(@Param('id') id: string) {
    return this.behaviorService.findOne(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get discipline records by student' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.behaviorService.findByStudent(studentId);
  }

  @Patch(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a discipline record' })
  update(@Param('id') id: string, @Body() updateDto: UpdateDisciplineRecordDto) {
    return this.behaviorService.update(id, updateDto);
  }

  @Patch(':id/resolve')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Resolve a discipline record' })
  resolve(@Param('id') id: string, @Body() resolveDto: ResolveDisciplineRecordDto, @User('id') resolverId: string) {
    return this.behaviorService.resolve(id, resolverId, resolveDto);
  }
}
