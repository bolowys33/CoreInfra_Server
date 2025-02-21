import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CardRequestService } from './card-request.service';
import {
  CreateCardRequestDto,
  UpdateCardStatusDto,
} from './dto/card-request.dto';
import { CardRequestModel } from 'src/models/card-request.model';
import { ResponseModel } from 'src/models/global.model';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Roles } from 'src/guards/decorator';
import { AuthenticatedRequest } from 'src/schema/request.schema';

@ApiTags('Card Requests')
@Controller('card-request')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiExtraModels(
  ResponseModel,
  CardRequestModel,
  CreateCardRequestDto,
  UpdateCardStatusDto,
)
export class CardRequestController {
  constructor(private readonly cardRequestService: CardRequestService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new card request' })
  @ApiBody({ type: CreateCardRequestDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardRequestModel) },
          },
        },
      ],
    },
  })
  async createRequest(
    @Body() dto: CreateCardRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ResponseModel<CardRequestModel>> {
    return await this.cardRequestService.createRequest(dto, req.user.id);
  }

  @Get('get-all')
  @Roles("admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all card requests' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(CardRequestModel) },
            },
          },
        },
      ],
    },
  })
  async getAllRequests(): Promise<ResponseModel<CardRequestModel[]>> {
    return await this.cardRequestService.getAllRequests();
  }

  @Get('get-one/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific card request by ID' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardRequestModel) },
          },
        },
      ],
    },
  })
  async getCardRequest(
    @Param('id') id: string,
  ): Promise<ResponseModel<CardRequestModel>> {
    return await this.cardRequestService.getRequest(id);
  }

  @Patch('update-status/:id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing card request status' })
  @ApiBody({ type: UpdateCardStatusDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardRequestModel) },
          },
        },
      ],
    },
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCardStatusDto,
  ): Promise<ResponseModel<CardRequestModel>> {
    return await this.cardRequestService.updateStatus(id, dto);
  }

  @Patch('download/:id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark as downloaded for production' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardRequestModel) },
          },
        },
      ],
    },
  })
  async downloadRequest(
    @Param('id') id: string,
  ): Promise<ResponseModel<CardRequestModel>> {
    return await this.cardRequestService.downloadRequest(id);
  }

  @Patch('dispatch/:id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark as dispatched for delivery' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardRequestModel) },
          },
        },
      ],
    },
  })
  async dispatchRequest(
    @Param('id') id: string,
  ): Promise<ResponseModel<CardRequestModel>> {
    return await this.cardRequestService.dispatchRequest(id);
  }

  @Delete('delete/:id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a card request' })
  @ApiOkResponse({
    description: 'The card request has been deleted successfully.',
    schema: { $ref: getSchemaPath(ResponseModel) },
  })
  async deleteRequest(
    @Param('id') id: string,
  ): Promise<ResponseModel<CardRequestModel>> {
    return await this.cardRequestService.deleteRequest(id);
  }
}
