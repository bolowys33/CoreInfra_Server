import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateCardSchemeDto,
  UpdateCardSchemeDto,
} from './dto/card-scheme.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { CardSchemeModel } from 'src/models/card-scheme.schema';
import { ResponseModel } from 'src/models/global.model';

@Injectable()
export class CardSchemeService {
  constructor(
    private readonly prisma: PrismaService,
    private singleResponseHelper: ResponseHelperService<CardSchemeModel>,
    private multiResponseHelper: ResponseHelperService<CardSchemeModel[]>,
  ) {}

  // Create a new card scheme
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
    const existingScheme = await this.prisma.cardScheme.findUnique({
      where: { id },
    });

    if (!existingScheme) {
      this.singleResponseHelper.returnNotFound(
        `Scheme with ID ${id} not found`,
      );
    }

    await this.prisma.cardScheme.delete({
      where: { id },
    });

    return this.singleResponseHelper.returnSuccessObject(
      'Scheme deleted successfully',
    );
  }
}
