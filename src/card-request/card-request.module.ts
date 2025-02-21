import { Module } from '@nestjs/common';
import { CardRequestService } from './card-request.service';
import { CardRequestController } from './card-request.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CardRequestController],
  providers: [CardRequestService],
})
export class CardRequestModule {}
