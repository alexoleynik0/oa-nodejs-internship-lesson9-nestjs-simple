import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { StrategyEnum } from '../interfaces/strategy.enum';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard(
  StrategyEnum['jwt-refresh'],
) {}
