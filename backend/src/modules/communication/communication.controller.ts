import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunicationService } from './communication.service';
import { CreateMessageDto, UpdateMessageDto } from './dto/communication.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { User } from '../../auth/decorators/user.decorator';

@ApiTags('Communication')
@Controller('communication')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Post('messages')
  @ApiOperation({ summary: 'Create a new message' })
  createMessage(
    @User('id') senderId: string,
    @Body() createDto: CreateMessageDto,
  ) {
    return this.communicationService.createMessage(senderId, createDto);
  }

  @Get('messages')
  @ApiOperation({ summary: 'Get all messages for the current user' })
  findMyMessages(@User('id') userId: string) {
    return this.communicationService.findByUser(userId);
  }

  @Get('messages/:id')
  @ApiOperation({ summary: 'Get a message by id' })
  findOne(@Param('id') id: string) {
    return this.communicationService.findOne(id);
  }

  @Patch('messages/:id')
  @ApiOperation({ summary: 'Update a message' })
  update(@Param('id') id: string, @Body() updateDto: UpdateMessageDto) {
    return this.communicationService.update(id, updateDto);
  }

  @Delete('messages/:id')
  @ApiOperation({ summary: 'Delete a message' })
  remove(@Param('id') id: string) {
    return this.communicationService.remove(id);
  }
}
