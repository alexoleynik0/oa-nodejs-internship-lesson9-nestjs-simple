import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { StrategyEnum } from '../interfaces/strategy.enum';

@Injectable()
export class LocalAuthGuard extends AuthGuard(StrategyEnum.local) {}
