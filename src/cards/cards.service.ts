import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/card.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { CardModel } from 'src/models/card.model';
import { ResponseModel } from 'src/models/global.model';

@Injectable()
export class CardsService {
  constructor(
    private readonly prisma: PrismaService,
    private singleResponseHelper: ResponseHelperService<CardModel>,
    private multiResponseHelper: ResponseHelperService<CardModel[]>,
  ) {}

  private generateRandomNumbers = (length: number): string => {
    return Math.floor(Math.random() * 10 ** length)
      .toString()
      .padStart(length, '0');
  };

  private formatCard(card: any): CardModel {
    return {
      id: card.id,
      cardHolder: card.cardHolder?.name || 'Unknown',
      batch: card.batch,
      cardType: card.cardType,
      pan: card.pan,
      expiry: card.expiry,
      createdAt: card.createdAt,
      fees:
        card.fees?.map((fee: any) => ({
          id: fee.id,
          name: fee.name,
          value: fee.value,
          currency: fee.currency,
          frequency: fee.frequency,
          impact: fee.impact,
          accountPad: fee.accountPad,
          account: fee.account || null,
        })) || [],
    };
  }

  async issueCard(dto: CreateCardDto): Promise<ResponseModel<CardModel>> {
    const { cardRequestId, issueType } = dto;

    const request = await this.prisma.cardRequest.findUnique({
      where: { id: cardRequestId },
      include: {
        cardProfile: {
          include: {
            cardScheme: true,
            fees: true,
          },
        },
        initiator: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    if (!request) {
      throw this.singleResponseHelper.returnNotFound(
        `Card request with ${cardRequestId} not found`,
      );
    }

    const panLength = request.cardProfile.cardScheme.panLength;
    const binPrefix = request.cardProfile.binPrefix;
    const pan = `${binPrefix}${this.generateRandomNumbers(panLength - binPrefix.length)}`;

    const card = await this.prisma.card.create({
      data: {
        userId: request.initiator.id,
        batch: request.batch,
        cardType: request.cardType,
        expiry: request.cardProfile.expiration,
        pan,
        issueType,
        fees: {
          connect: request.cardProfile.fees.map((fee) => ({ id: fee.id })),
        },
      },
      include: {
        fees: true,
        cardHolder: true,
      },
    });

    const data = this.formatCard(card);

    return this.singleResponseHelper.returnSuccessObject(
      'Card issued successfully',
      data,
    );
  }

  async getAllCards(): Promise<ResponseModel<CardModel[]>> {
    const cards = await this.prisma.card.findMany({
      include: {
        fees: true,
        cardHolder: true,
      },
    });

    if (!cards.length) {
      throw this.multiResponseHelper.returnNotFound('No cards found');
    }

    const data = cards.map((card) => this.formatCard(card));

    return this.multiResponseHelper.returnSuccessObject(
      'Cards retrieved successfully',
      data,
    );
  }

  async getCard(id: string): Promise<ResponseModel<CardModel>> {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: {
        fees: true,
        cardHolder: true,
      },
    });

    if (!card) {
      throw this.singleResponseHelper.returnNotFound(
        `Card with ID ${id} not found`,
      );
    }

    const data = this.formatCard(card);

    return this.singleResponseHelper.returnSuccessObject(
      'Card retrieved successfully',
      data,
    );
  }

  async deleteCard(id: string): Promise<ResponseModel<CardModel>> {
    const card = await this.prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      throw this.singleResponseHelper.returnNotFound(
        `Card with ID ${id} not found`,
      );
    }

    await this.prisma.card.delete({ where: { id } });

    return this.singleResponseHelper.returnSuccessObject(
      'Card deleted successfully',
    );
  }
}
