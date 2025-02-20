import { Injectable } from '@nestjs/common';
import {
  CreateCardProfileDto,
  UpdateCardProfileDto,
} from './dto/card-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { CardProfileModel } from 'src/models/card-profile.model';
import { ResponseModel } from 'src/models/global.model';

@Injectable()
export class CardProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private singleResponseHelper: ResponseHelperService<CardProfileModel>,
    private multiResponseHelper: ResponseHelperService<CardProfileModel[]>,
  ) {}

  private formatResult(profile: any): CardProfileModel {
    return {
      id: profile.id,
      name: profile.name,
      binPrefix: profile.binPrefix,
      expiration: profile.expiration,
      description: profile.description,
      currency: profile.currency,
      branchBlacklist: profile.branchBlacklist,
      cardScheme: profile.cardScheme.name,
      createdAt: profile.createdAt,
      fees: profile.fees.map((fee) => ({
        id: fee.id,
        name: fee.name,
        value: fee.value,
        currency: fee.currency,
        frequency: fee.frequency,
        impact: fee.impact,
        accountPad: fee.accountPad,
        account: fee.account ?? undefined,
      })),
    };
  }

  async createProfile(
    dto: CreateCardProfileDto,
  ): Promise<ResponseModel<CardProfileModel>> {
    const { cardSchemeId, fees, ...profileData } = dto;

    const cardScheme = await this.prisma.cardScheme.findUnique({
      where: { id: cardSchemeId },
    });

    if (!cardScheme) {
      this.singleResponseHelper.returnNotFound(
        `Card scheme with ID ${cardSchemeId} not found`,
      );
    }

    const data = await this.prisma.$transaction(async (prisma) => {
      const cardProfile = await prisma.cardProfile.create({
        data: {
          ...profileData,
          cardScheme: { connect: { id: cardSchemeId } },
        },
      });

      if (fees && fees?.length > 0) {
        await prisma.fee.createMany({
          data: fees.map((fee) => ({
            ...fee,
            cardProfileId: cardProfile.id,
          })),
        });
      }

      const result = await prisma.cardProfile.findUnique({
        where: { id: cardProfile.id },
        include: {
          cardScheme: { select: { name: true } },
          fees: true,
        },
      });

      if (!result) {
        this.singleResponseHelper.returnBadGateway('Error');
        return;
      }

      return this.formatResult(result);
    });

    return this.singleResponseHelper.returnSuccessObject(
      'Profile created successfully',
      data,
    );
  }

  async getAllProfiles(): Promise<ResponseModel<CardProfileModel[]>> {
    const profiles = await this.prisma.cardProfile.findMany({
      include: {
        cardScheme: { select: { name: true } },
        fees: true,
      },
    });

    if (profiles.length === 0) {
      this.singleResponseHelper.returnNotFound('No card profile found');
    }

    const data: CardProfileModel[] = profiles.map(this.formatResult);

    return this.multiResponseHelper.returnSuccessObject(
      'Card profiles fetched successfully',
      data,
    );
  }

  async getCardProfile(id: string): Promise<ResponseModel<CardProfileModel>> {
    const profile = await this.prisma.cardProfile.findUnique({
      where: { id },
      include: {
        cardScheme: { select: { name: true } },
        fees: true,
      },
    });

    if (!profile) {
      this.singleResponseHelper.returnNotFound(
        `Card profile with ${id} not found`,
      );
    }

    const data = this.formatResult(profile);

    return this.singleResponseHelper.returnSuccessObject(
      'Card profiles fetched successfully',
      data,
    );
  }

  async updateProfile(
    id: string,
    dto: UpdateCardProfileDto,
  ): Promise<ResponseModel<CardProfileModel>> {
    const { cardSchemeId, fees, ...profileData } = dto;

    const existingProfile = await this.prisma.cardProfile.findUnique({
      where: { id },
      include: { fees: true },
    });

    if (!existingProfile) {
      this.singleResponseHelper.returnNotFound(
        `Card profile with ID ${id} not found`,
      );
    }

    if (cardSchemeId) {
      const cardScheme = await this.prisma.cardScheme.findUnique({
        where: { id: cardSchemeId },
      });

      if (!cardScheme) {
        this.singleResponseHelper.returnNotFound(
          `Card scheme with ID ${cardSchemeId} not found`,
        );
      }
    }

    const updatedProfile = await this.prisma.$transaction(async (prisma) => {
      const updatedCardProfile = await prisma.cardProfile.update({
        where: { id },
        data: {
          ...profileData,
          cardScheme: cardSchemeId
            ? { connect: { id: cardSchemeId } }
            : undefined,
        },
      });

      if (fees && fees.length > 0) {
        await prisma.fee.deleteMany({ where: { cardProfileId: id } });

        await prisma.fee.createMany({
          data: fees.map((fee) => ({
            ...fee,
            cardProfileId: id,
          })),
        });
      }

      return prisma.cardProfile.findUnique({
        where: { id },
        include: {
          cardScheme: { select: { name: true } },
          fees: true,
        },
      });
    });

    if (!updatedProfile) {
      this.singleResponseHelper.returnBadGateway('Error updating profile');
    }

    return this.singleResponseHelper.returnSuccessObject(
      'Card profile updated successfully',
      this.formatResult(updatedProfile),
    );
  }

  async deleteProfile(id: string): Promise<ResponseModel<CardProfileModel>> {
    const existingProfile = await this.prisma.cardProfile.findUnique({
      where: { id },
      include: { fees: true },
    });

    if (!existingProfile) {
      this.singleResponseHelper.returnNotFound(
        `Card profile with ID ${id} not found`,
      );
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.fee.deleteMany({
        where: { cardProfileId: id },
      });

      await prisma.cardProfile.delete({
        where: { id },
      });
    });

    return this.singleResponseHelper.returnSuccessObject(
      'Card profile deleted successfully',
    );
  }
}
