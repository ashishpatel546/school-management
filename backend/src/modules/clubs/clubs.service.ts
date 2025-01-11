import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from '../../entities/clubs/club.entity';
import { ClubEvent } from '../../entities/clubs/club-event.entity';
import { User } from '../../entities/user.entity';
import { CreateClubDto, CreateClubEventDto, UpdateClubDto, UpdateClubEventDto } from './dto/clubs.dto';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
    @InjectRepository(ClubEvent)
    private eventRepository: Repository<ClubEvent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createClub(createDto: CreateClubDto): Promise<Club> {
    const supervisor = await this.userRepository.findOne({
      where: { id: createDto.supervisorId },
    });
    if (!supervisor) {
      throw new NotFoundException(`User with ID ${createDto.supervisorId} not found`);
    }

    const club = this.clubRepository.create({
      ...createDto,
      supervisor,
    });

    return await this.clubRepository.save(club);
  }

  async findAllClubs(): Promise<Club[]> {
    return await this.clubRepository.find({
      where: { isActive: true },
      relations: ['supervisor', 'members', 'events'],
    });
  }

  async findClubById(id: string): Promise<Club> {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: ['supervisor', 'members', 'events'],
    });
    if (!club) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }
    return club;
  }

  async updateClub(id: string, updateDto: UpdateClubDto): Promise<Club> {
    const club = await this.findClubById(id);
    Object.assign(club, updateDto);
    return await this.clubRepository.save(club);
  }

  async removeClub(id: string): Promise<void> {
    const club = await this.findClubById(id);
    club.isActive = false;
    await this.clubRepository.save(club);
  }

  async addMember(clubId: string, userId: string): Promise<Club> {
    const club = await this.findClubById(clubId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (club.maxMembers > 0 && club.members.length >= club.maxMembers) {
      throw new Error('Club has reached maximum member capacity');
    }

    club.members = [...(club.members || []), user];
    return await this.clubRepository.save(club);
  }

  async removeMember(clubId: string, userId: string): Promise<Club> {
    const club = await this.findClubById(clubId);
    club.members = club.members.filter(member => member.id !== userId);
    return await this.clubRepository.save(club);
  }

  async createEvent(organizerId: string, createDto: CreateClubEventDto): Promise<ClubEvent> {
    const club = await this.findClubById(createDto.clubId);
    const organizer = await this.userRepository.findOne({
      where: { id: organizerId },
    });
    if (!organizer) {
      throw new NotFoundException(`User with ID ${organizerId} not found`);
    }

    const event = this.eventRepository.create({
      ...createDto,
      club,
      organizer,
    });

    return await this.eventRepository.save(event);
  }

  async findEventById(id: string): Promise<ClubEvent> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['club', 'organizer'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async updateEvent(id: string, updateDto: UpdateClubEventDto): Promise<ClubEvent> {
    const event = await this.findEventById(id);
    Object.assign(event, updateDto);
    return await this.eventRepository.save(event);
  }

  async findClubsByCategory(category: string): Promise<Club[]> {
    return await this.clubRepository.find({
      where: { category, isActive: true },
      relations: ['supervisor', 'members', 'events'],
    });
  }

  async findUpcomingEvents(): Promise<ClubEvent[]> {
    const now = new Date();
    return await this.eventRepository.find({
      where: {
        startDate: MoreThanOrEqual(now),
      },
      relations: ['club', 'organizer'],
      order: { startDate: 'ASC' },
    });
  }
}
