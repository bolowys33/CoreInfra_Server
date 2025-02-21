import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { CreateCardDto } from './dto/card.dto';
import { CardModel } from 'src/models/card.model';
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
import { CardsService } from './cards.service';

@ApiTags('Cards')
@Controller('card')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiExtraModels(ResponseModel, CardModel, CreateCardDto)
export class CardsController {
  constructor(private readonly cardService: CardsService) {}

  @Post('issue')
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new card' })
  @ApiBody({ type: CreateCardDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardModel) },
          },
        },
      ],
    },
  })
  async createCard(
    @Body() dto: CreateCardDto,
  ): Promise<ResponseModel<CardModel>> {
    return await this.cardService.issueCard(dto);
  }

  @Get('get-all')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all cards' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(CardModel) },
            },
          },
        },
      ],
    },
  })
  async getAllCards(): Promise<ResponseModel<CardModel[]>> {
    return await this.cardService.getAllCards();
  }

  @Get('get-one/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific card by ID' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardModel) },
          },
        },
      ],
    },
  })
  async getCard(@Param('id') id: string): Promise<ResponseModel<CardModel>> {
    return await this.cardService.getCard(id);
  }

  @Delete('delete/:id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a card' })
  @ApiOkResponse({
    description: 'The card has been deleted successfully.',
    schema: { $ref: getSchemaPath(ResponseModel) },
  })
  async deleteCard(@Param('id') id: string): Promise<ResponseModel<CardModel>> {
    return await this.cardService.deleteCard(id);
  }
}
