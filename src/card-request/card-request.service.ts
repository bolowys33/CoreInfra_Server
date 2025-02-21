import { Injectable } from '@nestjs/common';
import {
  CreateCardRequestDto,
  UpdateCardStatusDto,
} from './dto/card-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CardRequestModel } from 'src/models/card-request.model';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { ResponseModel } from 'src/models/global.model';
import { Status } from '@prisma/client';

@Injectable()
export class CardRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private singleResponseHelper: ResponseHelperService<CardRequestModel>,
    private multiResponseHelper: ResponseHelperService<CardRequestModel[]>,
  ) {}

  private formatRequest(request: any) {
    return {
      id: request.id,
      branch: request.branch,
      batch: request.batch,
      status: request.status,
      cardType: request.cardType,
      initiator: request.initiator?.name,
      charges: request.charges,
      isDownloaded: request.isDownloaded,
      isSent: request.isSent,
      createdAt: request.createdAt,
      cardProfile: request.cardProfile?.name,
    };
  }

  private validateStatusUpdate(cardRequest: any, status: Status): void {
    if (!cardRequest.isDownloaded) {
      this.singleResponseHelper.returnForbidden(
        `Please download card details first`,
      );
    }

    if (status === Status.READY && cardRequest.status !== Status.IN_PROGRESS) {
      this.singleResponseHelper.returnForbidden(
        `Card production is not in progress`,
      );
    }

    if (
      status === Status.ACKNOWLEDGED &&
      (cardRequest.status !== Status.READY || !cardRequest.isSent)
    ) {
      this.singleResponseHelper.returnForbidden(
        `Card is not ready to be marked as acknowledged`,
      );
    }
  }

  async createRequest(
    dto: CreateCardRequestDto,
    userId: string,
  ): Promise<ResponseModel<CardRequestModel>> {
    const cardProfileExists = await this.prisma.cardProfile.findUnique({
      where: { id: dto.cardProfileId },
    });

    if (!cardProfileExists) {
      this.singleResponseHelper.returnNotFound(
        `Card Profile with ID ${dto.cardProfileId} not found`,
      );
    }

    const count = await this.prisma.cardRequest.count();

    const request = await this.prisma.cardRequest.create({
      data: {
        branch: dto.branch,
        batch: 253441667 + count,
        cardType: dto.cardType,
        charges: '₦1,500',
        cardProfileId: dto.cardProfileId,
        userId: userId,
        isDownloaded: false,
        isSent: false,
      },
      include: {
        initiator: { select: { name: true } },
        cardProfile: { select: { name: true } },
      },
    });

    const data: CardRequestModel = this.formatRequest(request);

    return this.singleResponseHelper.returnSuccessObject(
      'Card request successful',
      data,
    );
  }

  async getAllRequests(): Promise<ResponseModel<CardRequestModel[]>> {
    const requests = await this.prisma.cardRequest.findMany({
      include: {
        initiator: { select: { name: true } },
        cardProfile: { select: { name: true } },
      },
    });

    if (requests.length === 0) {
      this.singleResponseHelper.returnNotFound(`No requests found`);
    }

    const data: CardRequestModel[] = requests.map((request) =>
      this.formatRequest(request),
    );

    return this.multiResponseHelper.returnSuccessObject(
      'Card requests fetched successfully',
      data,
    );
  }

  async getRequest(id: string): Promise<ResponseModel<CardRequestModel>> {
    const cardRequest = await this.prisma.cardRequest.findUnique({
      where: { id },
      include: {
        initiator: { select: { name: true } },
        cardProfile: { select: { name: true } },
      },
    });

    if (!cardRequest) {
      this.singleResponseHelper.returnNotFound(
        `Card Request with ID ${id} not found`,
      );
    }

    const data: CardRequestModel = this.formatRequest(cardRequest);

    return this.singleResponseHelper.returnSuccessObject(
      'Card request fetched successfully',
      data,
    );
  }

  async updateStatus(
    id: string,
    dto: UpdateCardStatusDto,
  ): Promise<ResponseModel<CardRequestModel>> {
    const cardRequest = await this.prisma.cardRequest.findUnique({
      where: { id },
    });

    if (!cardRequest) {
      this.singleResponseHelper.returnNotFound(
        `Card Request with ID ${id} not found`,
      );
    }

    this.validateStatusUpdate(cardRequest, dto.status);

    const request = await this.prisma.cardRequest.update({
      where: { id },
      data: { status: dto.status },
      include: {
        initiator: { select: { name: true } },
        cardProfile: { select: { name: true } },
      },
    });

    const data = this.formatRequest(request);

    return this.singleResponseHelper.returnSuccessObject(
      'Card request status updated successfully',
      data,
    );
  }

  async dispatchRequest(id: string): Promise<ResponseModel<CardRequestModel>> {
    const cardRequest = await this.prisma.cardRequest.findUnique({
      where: { id },
    });

    if (!cardRequest) {
      this.singleResponseHelper.returnNotFound(
        `Card Request with ID ${id} not found`,
      );
    }

    const request = await this.prisma.cardRequest.update({
      where: { id },
      data: { isSent: true },
      include: {
        initiator: { select: { name: true } },
        cardProfile: { select: { name: true } },
      },
    });

    const data = this.formatRequest(request);

    return this.singleResponseHelper.returnSuccessObject(
      'Card request sent for dispatch',
      data,
    );
  }

  async downloadRequest(id: string): Promise<ResponseModel<CardRequestModel>> {
    const cardRequest = await this.prisma.cardRequest.findUnique({
      where: { id },
    });

    if (!cardRequest) {
      this.singleResponseHelper.returnNotFound(
        `Card Request with ID ${id} not found`,
      );
    }

    const request = await this.prisma.cardRequest.update({
      where: { id },
      data: { isDownloaded: true },
      include: {
        initiator: { select: { name: true } },
        cardProfile: { select: { name: true } },
      },
    });

    const data = this.formatRequest(request);

    return this.singleResponseHelper.returnSuccessObject(
      'Card request downloaded for production',
      data,
    );
  }

  async deleteRequest(id: string): Promise<ResponseModel<CardRequestModel>> {
    const cardRequest = await this.prisma.cardRequest.findUnique({
      where: { id },
    });

    if (!cardRequest) {
      this.singleResponseHelper.returnNotFound(
        `Card Request with ID ${id} not found`,
      );
    }

    await this.prisma.cardRequest.delete({ where: { id } });

    return this.singleResponseHelper.returnSuccessObject(
      'Card request deleted successfully',
    );
  }
}
