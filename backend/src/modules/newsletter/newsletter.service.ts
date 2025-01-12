import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Newsletter, NewsletterStatus } from '../../entities/newsletter/newsletter.entity';
import { User } from '../../entities/user.entity';
import { CreateNewsletterDto, UpdateNewsletterDto } from './dto/newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(Newsletter)
    private newsletterRepository: Repository<Newsletter>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(authorId: string, createDto: CreateNewsletterDto): Promise<Newsletter> {
    const author = await this.userRepository.findOne({
      where: { id: authorId },
    });
    if (!author) {
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }

    const newsletter = this.newsletterRepository.create({
      ...createDto,
      author,
      status: NewsletterStatus.DRAFT,
    });

    return await this.newsletterRepository.save(newsletter);
  }

  async findAll(): Promise<Newsletter[]> {
    return await this.newsletterRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPublished(): Promise<Newsletter[]> {
    return await this.newsletterRepository.find({
      where: { status: NewsletterStatus.PUBLISHED },
      relations: ['author'],
      order: { publishedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Newsletter> {
    const newsletter = await this.newsletterRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!newsletter) {
      throw new NotFoundException(`Newsletter with ID ${id} not found`);
    }
    return newsletter;
  }

  async update(id: string, updateDto: UpdateNewsletterDto): Promise<Newsletter> {
    const newsletter = await this.findOne(id);
    
    if (updateDto.status === NewsletterStatus.PUBLISHED && newsletter.status !== NewsletterStatus.PUBLISHED) {
      newsletter.publishedAt = new Date();
    }
    
    Object.assign(newsletter, updateDto);
    return await this.newsletterRepository.save(newsletter);
  }

  async remove(id: string): Promise<void> {
    const newsletter = await this.findOne(id);
    newsletter.status = NewsletterStatus.ARCHIVED;
    await this.newsletterRepository.save(newsletter);
  }

  async incrementViews(id: string): Promise<void> {
    await this.newsletterRepository.increment({ id }, 'views', 1);
  }

  async findByTag(tag: string): Promise<Newsletter[]> {
    return await this.newsletterRepository.find({
      where: { status: NewsletterStatus.PUBLISHED },
      relations: ['author'],
      order: { publishedAt: 'DESC' },
    }).then(newsletters => 
      newsletters.filter(newsletter => newsletter.tags?.includes(tag))
    );
  }
}
