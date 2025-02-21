import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { HelperModule } from './helper/helper.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CardSchemeModule } from './card-scheme/card-scheme.module';
import { CardProfileModule } from './card-profile/card-profile.module';
import { CardRequestModule } from './card-request/card-request.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HelperModule,
    AuthModule,
    UsersModule,
    CardSchemeModule,
    CardProfileModule,
    CardRequestModule,
    CardsModule,
  ],
})
export class AppModule {}
