import { Module } from '@nestjs/common';
import { HousekeepingModule } from './housekeeping/housekeeping.module';

@Module({
  imports: [HousekeepingModule],
})
export class AppModule {}
