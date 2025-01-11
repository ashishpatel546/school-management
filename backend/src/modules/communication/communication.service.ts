import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../../entities/user.entity';
import { CreateMessageDto, UpdateMessageDto } from './dto/communication.dto';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createMessage(senderId: string, createDto: CreateMessageDto): Promise<Message> {
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    if (!sender) {
      throw new NotFoundException(`Sender with ID ${senderId} not found`);
    }

    const receiver = await this.userRepository.findOne({ where: { id: createDto.receiverId } });
    if (!receiver) {
      throw new NotFoundException(`Receiver with ID ${createDto.receiverId} not found`);
    }

    const message = this.messageRepository.create({
      sender,
      receiver,
      content: createDto.content,
      subject: createDto.subject,
      timestamp: new Date(),
    });

    return await this.messageRepository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find({
      relations: ['sender', 'receiver'],
    });
  }

  async findByUser(userId: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: [
        { sender: { id: userId } },
        { receiver: { id: userId } },
      ],
      relations: ['sender', 'receiver'],
      order: { timestamp: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async update(id: string, updateDto: UpdateMessageDto): Promise<Message> {
    const message = await this.findOne(id);
    Object.assign(message, updateDto);
    return await this.messageRepository.save(message);
  }

  async remove(id: string): Promise<void> {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
  }
}
