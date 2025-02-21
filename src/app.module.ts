import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { HelperModule } from './helper/helper.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CardSchemeModule } from './card-scheme/card-scheme.module';
import { CardProfileModule } from './card-profile/card-profile.module';
import { CardRequestModule } from './card-request/card-request.module';
import { CardsModule } from './cards/cards.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: true,
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"${configService.get<string>('SMTP_SENDER_NAME')}" <${configService.get<string>('SMTP_USER')}>`,
        },
      }),
    }),
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
