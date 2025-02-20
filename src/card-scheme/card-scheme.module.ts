import { Module } from '@nestjs/common';
import { CardSchemeService } from './card-scheme.service';
import { CardSchemeController } from './card-scheme.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CardSchemeController],
  providers: [CardSchemeService],
})
export class CardSchemeModule {}
