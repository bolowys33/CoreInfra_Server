import { Module } from '@nestjs/common';
import { CardProfileService } from './card-profile.service';
import { CardProfileController } from './card-profile.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CardProfileController],
  providers: [CardProfileService],
})
export class CardProfileModule {}
