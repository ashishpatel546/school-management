import { SetMetadata } from '@nestjs/common';
import { FeatureType } from '../../../entities/feature.entity';

export const RequireFeature = (feature: FeatureType) => SetMetadata('feature', feature);
