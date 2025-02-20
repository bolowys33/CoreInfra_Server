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
} from '@nestjs/common';
import { CardSchemeService } from './card-scheme.service';
import {
  CreateCardSchemeDto,
  UpdateCardSchemeDto,
} from './dto/card-scheme.dto';
import { CardSchemeModel } from 'src/models/card-scheme.model';
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

@ApiTags('Card Schemes')
@Controller('card-scheme')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiExtraModels(
  ResponseModel,
  CardSchemeModel,
  CreateCardSchemeDto,
  UpdateCardSchemeDto,
)
export class CardSchemeController {
  constructor(private readonly cardSchemeService: CardSchemeService) {}

  @Post('create')
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Allows admin to create a new card scheme' })
  @ApiBody({ type: CreateCardSchemeDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardSchemeModel) },
          },
        },
      ],
    },
  })
  async createScheme(
    @Body() createCardSchemeDto: CreateCardSchemeDto,
  ): Promise<ResponseModel<CardSchemeModel>> {
    return await this.cardSchemeService.createScheme(createCardSchemeDto);
  }

  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all card schemes' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(CardSchemeModel) },
            },
          },
        },
      ],
    },
  })
  async getAllScheme(): Promise<ResponseModel<CardSchemeModel[]>> {
    return await this.cardSchemeService.getAllSchemes();
  }

  @Get('get-one/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific card scheme by ID' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardSchemeModel) },
          },
        },
      ],
    },
  })
  async getScheme(
    @Param('id') id: string,
  ): Promise<ResponseModel<CardSchemeModel>> {
    return await this.cardSchemeService.getScheme(id);
  }

  @Patch('update/:id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Allows admin to update an existing card scheme' })
  @ApiBody({ type: UpdateCardSchemeDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardSchemeModel) },
          },
        },
      ],
    },
  })
  async updateScheme(
    @Param('id') id: string,
    @Body() updateCardSchemeDto: UpdateCardSchemeDto,
  ): Promise<ResponseModel<CardSchemeModel>> {
    return await this.cardSchemeService.updateScheme(id, updateCardSchemeDto);
  }

  @Delete('delete/:id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Allows admin to delete a card scheme' })
  @ApiOkResponse({
    description: 'The card scheme has been deleted successfully.',
    schema: { $ref: getSchemaPath(ResponseModel) },
  })
  deleteScheme(
    @Param('id') id: string,
  ): Promise<ResponseModel<CardSchemeModel>> {
    return this.cardSchemeService.deleteScheme(id);
  }
}
