import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClubsService } from './clubs.service';
import { CreateClubDto, CreateClubEventDto, UpdateClubDto, UpdateClubEventDto } from './dto/clubs.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';

@ApiTags('Clubs')
@Controller('clubs')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new club' })
  createClub(@Body() createDto: CreateClubDto) {
    return this.clubsService.createClub(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active clubs' })
  findAllClubs() {
    return this.clubsService.findAllClubs();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get clubs by category' })
  findByCategory(@Param('category') category: string) {
    return this.clubsService.findClubsByCategory(category);
  }

  @Get('events/upcoming')
  @ApiOperation({ summary: 'Get upcoming club events' })
  findUpcomingEvents() {
    return this.clubsService.findUpcomingEvents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a club by id' })
  findOne(@Param('id') id: string) {
    return this.clubsService.findClubById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a club' })
  update(@Param('id') id: string, @Body() updateDto: UpdateClubDto) {
    return this.clubsService.updateClub(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remove a club' })
  remove(@Param('id') id: string) {
    return this.clubsService.removeClub(id);
  }

  @Post(':id/members/:userId')
  @ApiOperation({ summary: 'Add a member to a club' })
  addMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.clubsService.addMember(id, userId);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a member from a club' })
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.clubsService.removeMember(id, userId);
  }

  @Post('events')
  @Roles(UserRole.TEACHER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new club event' })
  createEvent(@User('id') organizerId: string, @Body() createDto: CreateClubEventDto) {
    return this.clubsService.createEvent(organizerId, createDto);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get a club event by id' })
  findEvent(@Param('id') id: string) {
    return this.clubsService.findEventById(id);
  }

  @Patch('events/:id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a club event' })
  updateEvent(@Param('id') id: string, @Body() updateDto: UpdateClubEventDto) {
    return this.clubsService.updateEvent(id, updateDto);
  }
}
