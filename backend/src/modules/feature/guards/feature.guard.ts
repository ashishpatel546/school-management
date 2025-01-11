import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureService } from '../feature.service';
import { FeatureType } from '../../../entities/feature.entity';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private featureService: FeatureService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const feature = this.reflector.get<FeatureType>('feature', context.getHandler());
    if (!feature) {
      return true;
    }

    return await this.featureService.isFeatureEnabled(feature);
  }
}
