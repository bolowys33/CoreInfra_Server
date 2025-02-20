import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateCardSchemeDto,
  UpdateCardSchemeDto,
} from './dto/card-scheme.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { CardSchemeModel } from 'src/models/card-scheme.model';
import { ResponseModel } from 'src/models/global.model';

@Injectable()
export class CardSchemeService {
  constructor(
    private readonly prisma: PrismaService,
    private singleResponseHelper: ResponseHelperService<CardSchemeModel>,
    private multiResponseHelper: ResponseHelperService<CardSchemeModel[]>,
  ) {}

  async createScheme(
    dto: CreateCardSchemeDto,
  ): Promise<ResponseModel<CardSchemeModel>> {
    const scheme = await this.prisma.cardScheme.create({
      data: dto,
    });

    return this.singleResponseHelper.returnSuccessObject(
      'Scheme created successfully',
      scheme,
    );
  }

  async getAllSchemes(): Promise<ResponseModel<CardSchemeModel[]>> {
    const schemes = await this.prisma.cardScheme.findMany();

    if (schemes.length === 0) {
      this.singleResponseHelper.returnNotFound('No scheme found');
    }

    return this.multiResponseHelper.returnSuccessObject(
      'Schemes fetched successfully',
      schemes,
    );
  }

  async getScheme(id: string): Promise<ResponseModel<CardSchemeModel>> {
    const scheme = await this.prisma.cardScheme.findUnique({
      where: { id },
    });

    if (!scheme) {
      throw new NotFoundException(`Scheme with ID ${id} not found`);
    }

    return this.singleResponseHelper.returnSuccessObject(
      'Scheme fetched successfully',
      scheme,
    );
  }

  async updateScheme(
    id: string,
    dto: UpdateCardSchemeDto,
  ): Promise<ResponseModel<CardSchemeModel>> {
    const existingScheme = await this.prisma.cardScheme.findUnique({
      where: { id },
    });

    if (!existingScheme) {
      this.singleResponseHelper.returnNotFound(
        `Scheme with ID ${id} not found`,
      );
    }

    const updatedScheme = await this.prisma.cardScheme.update({
      where: { id },
      data: dto,
    });

    return this.singleResponseHelper.returnSuccessObject(
      'Scheme updated successfully',
      updatedScheme,
    );
  }

  async deleteScheme(id: string): Promise<ResponseModel<CardSchemeModel>> {
    return this.prisma.$transaction(async (prisma) => {
      const existingScheme = await prisma.cardScheme.findUnique({
        where: { id },
        include: {
          cardProfile: {
            include: {
              fees: true,
            },
          },
        },
      });

      if (!existingScheme) {
        throw this.singleResponseHelper.returnNotFound(
          `Scheme with ID ${id} not found`,
        );
      }

      const profileIds = existingScheme.cardProfile.map(
        (profile) => profile.id,
      );

      if (profileIds.length > 0) {
        await prisma.fee.deleteMany({
          where: {
            cardProfileId: { in: profileIds },
          },
        });

        await prisma.cardProfile.deleteMany({
          where: {
            cardSchemeId: id,
          },
        });
      }

      await prisma.cardScheme.delete({
        where: { id },
      });

      return this.singleResponseHelper.returnSuccessObject(
        'Scheme and all related profiles and fees deleted successfully',
      );
    });
  }
}
