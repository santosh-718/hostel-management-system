import { Module } from '@nestjs/common';
import { GuestModule } from './guest/guest.module';

@Module({
  imports: [GuestModule],
})
export class AppModule {}
