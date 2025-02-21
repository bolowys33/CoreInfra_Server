import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/users/dto/user.dto';
import { SignInDto, VerifyOtpDto } from './dto/auth.dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseModel } from 'src/models/global.model';
import {
  RegisterResponseModel,
  SignInResponseModel,
} from 'src/models/authentication.model';

@Controller('auth')
@ApiTags('Auth')
@ApiExtraModels(
  ResponseModel,
  SignUpDto,
  RegisterResponseModel,
  VerifyOtpDto,
  SignInResponseModel,
)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Allows user registration or sign up',
  })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(RegisterResponseModel) },
          },
        },
      ],
    },
  })
  async register(@Body() dto: SignUpDto) {
    return this.authService.register(dto);
  }

  @Post('register-admin')
  @ApiOperation({
    summary: 'Allows admin registration or sign up',
  })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(RegisterResponseModel) },
          },
        },
      ],
    },
  })
  async registerAdmin(@Body() dto: SignUpDto) {
    return this.authService.registerAdmin(dto);
  }

  @ApiOperation({
    summary: 'Allows users and admin sign in',
  })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseModel) },
        {
          properties: {
            data: { $ref: getSchemaPath(SignInResponseModel) },
          },
        },
      ],
    },
  })
  @Post('login')
  async login(@Body() dto: SignInDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({
    summary: 'Verification of accounts',
  })
  @ApiBody({ type: VerifyOtpDto })
  @ApiOkResponse({
    schema: {
      allOf: [{ $ref: getSchemaPath(ResponseModel) }],
    },
  })
  @Post('verify-account')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyAccount(dto);
  }
}
