import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { HelperModule } from './helper/helper.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CardSchemeModule } from './card-scheme/card-scheme.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HelperModule,
    UsersModule,
    AuthModule,
    CardSchemeModule,
  ],
})
export class AppModule {}
