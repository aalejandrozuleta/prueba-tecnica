import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
} from '@nestjs/terminus';

import { Headers } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
  ) { }

  @Get('live')
  @HealthCheck()
  live() {
    return this.health.check([]);
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([]);
  }

  @Get('lang')
  debugLang(@Headers() headers: Record<string, string>) {
    const i18n = I18nContext.current();

    return {
      resolvedLang: i18n?.lang,
      headers,
    };
  }
}
