import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto, UpdateNewsletterDto } from './dto/newsletter.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { User } from '../../auth/decorators/user.decorator';

@ApiTags('Newsletter')
@Controller('newsletter')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new newsletter' })
  create(@User('id') authorId: string, @Body() createDto: CreateNewsletterDto) {
    return this.newsletterService.create(authorId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all newsletters' })
  findAll() {
    return this.newsletterService.findAll();
  }

  @Get('published')
  @ApiOperation({ summary: 'Get all published newsletters' })
  findPublished() {
    return this.newsletterService.findPublished();
  }

  @Get('tag/:tag')
  @ApiOperation({ summary: 'Get newsletters by tag' })
  findByTag(@Param('tag') tag: string) {
    return this.newsletterService.findByTag(tag);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a newsletter by id' })
  async findOne(@Param('id') id: string) {
    await this.newsletterService.incrementViews(id);
    return this.newsletterService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a newsletter' })
  update(@Param('id') id: string, @Body() updateDto: UpdateNewsletterDto) {
    return this.newsletterService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Archive a newsletter' })
  remove(@Param('id') id: string) {
    return this.newsletterService.remove(id);
  }
}
