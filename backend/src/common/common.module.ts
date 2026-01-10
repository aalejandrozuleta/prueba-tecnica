import { Module } from '@nestjs/common';
import { EnvModule } from '@/config/env/env.module';

@Module({
  imports: [
    EnvModule, // 🔑 NECESARIO
  ],
  providers: [
  ],
})
export class CommonModule {}
