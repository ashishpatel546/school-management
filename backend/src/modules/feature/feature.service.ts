import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature, FeatureType } from '../../entities/feature.entity';
import { UpdateFeatureDto } from './dto/feature.dto';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
  ) {}

  async findAll(): Promise<Feature[]> {
    return await this.featureRepository.find();
  }

  async findOne(id: string): Promise<Feature> {
    const feature = await this.featureRepository.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException(`Feature with ID ${id} not found`);
    }
    return feature;
  }

  async findByName(name: FeatureType): Promise<Feature> {
    const feature = await this.featureRepository.findOne({ where: { name } });
    if (!feature) {
      throw new NotFoundException(`Feature ${name} not found`);
    }
    return feature;
  }

  async update(id: string, updateFeatureDto: UpdateFeatureDto): Promise<Feature> {
    const feature = await this.findOne(id);
    Object.assign(feature, updateFeatureDto);
    return await this.featureRepository.save(feature);
  }

  async isFeatureEnabled(name: FeatureType): Promise<boolean> {
    const feature = await this.featureRepository.findOne({ where: { name } });
    return feature?.isEnabled || false;
  }

  async initializeFeatures(): Promise<void> {
    const features = Object.values(FeatureType);
    for (const featureType of features) {
      const existingFeature = await this.featureRepository.findOne({
        where: { name: featureType },
      });
      if (!existingFeature) {
        const feature = this.featureRepository.create({
          name: featureType,
          isEnabled: false,
          description: `${featureType.toLowerCase()} feature`,
        });
        await this.featureRepository.save(feature);
      }
    }
  }
}
