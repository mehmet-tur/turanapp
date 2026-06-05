import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/auth.decorators';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'unluapp-api',
      timestamp: new Date().toISOString(),
    };
  }
}
