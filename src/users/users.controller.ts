import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedRequest } from 'src/schema/request.schema';
import { UpdateUserDto } from './dto/user.dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseModel } from 'src/models/global.model';
import { UserResponseModel } from 'src/models/user-profile.model';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Roles } from 'src/guards/decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiExtraModels(ResponseModel, UserResponseModel, UpdateUserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Allows user to get their profile details',
  })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserResponseModel) },
          },
        },
      ],
    },
  })
  async getUser(@Req() req: AuthenticatedRequest) {
    return await this.usersService.getUser(req);
  }

  @Get('get-all')
  @Roles('admin')
  @ApiOperation({
    summary: 'Allows admin to fetch all user account/profile',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(UserResponseModel) },
            },
          },
        },
      ],
    },
  })
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Patch('update-user')
  @ApiOperation({
    summary: 'Allows user to update their profile',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserResponseModel) },
          },
        },
      ],
    },
  })
  async updateUser(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(req.user.id, dto);
  }

  @Delete('delete-user')
  @ApiOperation({
    summary: 'Allows user to delete their account',
  })
  @ApiOkResponse({
    description: 'The user has been deleted successfully.',
    schema: { $ref: getSchemaPath(ResponseModel) },
  })
  async deleteUser(req: AuthenticatedRequest) {
    return await this.usersService.deleteUser(req.user.id);
  }
}
