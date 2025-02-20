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
import { CardProfileService } from './card-profile.service';
import {
  CreateCardProfileDto,
  UpdateCardProfileDto,
} from './dto/card-profile.dto';
import { CardProfileModel } from 'src/models/card-profile.model';
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

@ApiTags('Card Profiles')
@Controller('card-profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiExtraModels(
  ResponseModel,
  CardProfileModel,
  CreateCardProfileDto,
  UpdateCardProfileDto,
)
export class CardProfileController {
  constructor(private readonly cardProfileService: CardProfileService) {}

  @Post('create')
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Allows admin to create a new card profile' })
  @ApiBody({ type: CreateCardProfileDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardProfileModel) },
          },
        },
      ],
    },
  })
  async createProfile(
    @Body() dto: CreateCardProfileDto,
  ): Promise<ResponseModel<CardProfileModel>> {
    return await this.cardProfileService.createProfile(dto);
  }

  @Get('get-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all card profiles' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(CardProfileModel) },
            },
          },
        },
      ],
    },
  })
  async getAllProfiles(): Promise<ResponseModel<CardProfileModel[]>> {
    return await this.cardProfileService.getAllProfiles();
  }

  @Get('get-one/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific card profile by ID' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardProfileModel) },
          },
        },
      ],
    },
  })
  async getCardProfile(
    @Param('id') id: string,
  ): Promise<ResponseModel<CardProfileModel>> {
    return await this.cardProfileService.getCardProfile(id);
  }

  @Patch('update/:id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Allows admin to update an existing card profile' })
  @ApiBody({ type: UpdateCardProfileDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(CardProfileModel) },
          },
        },
      ],
    },
  })
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateCardProfileDto,
  ): Promise<ResponseModel<CardProfileModel>> {
    return await this.cardProfileService.updateProfile(id, dto);
  }

  @Delete('delete/:id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Allows admin to delete a card profile' })
  @ApiOkResponse({
    description: 'The card profile has been deleted successfully.',
    schema: { $ref: getSchemaPath(ResponseModel) },
  })
  async deleteProfile(
    @Param('id') id: string,
  ): Promise<ResponseModel<CardProfileModel>> {
    return await this.cardProfileService.deleteProfile(id);
  }
}
