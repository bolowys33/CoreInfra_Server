import {
  Injectable,
  
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { OtpService } from './otp.service';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import {
  RegisterResponseModel,
  SignInResponseModel,
} from 'src/models/authentication.model';
import { SignInDto, SignUpDto, VerifyOtpDto } from './dto/auth.dto';
import { ResponseModel } from 'src/models/global.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private signUpResponseHelper: ResponseHelperService<RegisterResponseModel>,
    private verifyResponseHelper: ResponseHelperService<undefined>,
    private signInResponseHelper: ResponseHelperService<SignInResponseModel>,
  ) {}

  async register(
    dto: SignUpDto,
  ): Promise<ResponseModel<RegisterResponseModel>> {
    const { email, name, password } = dto;
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: {
          mode: 'insensitive',
          equals: email,
        },
      },
    });

    if (existingUser) {
      this.signUpResponseHelper.returnConflict(
        'A user with the email address exists',
      );
    }

    const hashedPassword = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const otp = this.otpService.generateOTP(6);

    const token = this.jwtService.sign({
      userId: user.id,
      otp,
    });

    return this.signUpResponseHelper.returnSuccessObject(
      'Account created successfully',
      {
        token: token,
      },
    );
  }

  async registerAdmin(
    dto: SignUpDto,
  ): Promise<ResponseModel<RegisterResponseModel>> {
    const { email, name, password } = dto;
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: {
          mode: 'insensitive',
          equals: email,
        },
      },
    });

    if (existingUser) {
      this.signUpResponseHelper.returnConflict(
        'A user with the email address exists',
      );
    }

    const hashedPassword = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name, isAdmin: true },
    });

    const otp = this.otpService.generateOTP(6);

    const token = this.jwtService.sign({
      userId: user.id,
      otp,
    });

    return this.signUpResponseHelper.returnSuccessObject(
      'Account created successfully',
      {
        token: token,
      },
    );
  }

  async login(dto: SignInDto): Promise<ResponseModel<SignInResponseModel>> {
    const { email, password } = dto;

    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          mode: 'insensitive',
          equals: email,
        },
      },
    });

    if (!user) {
      throw this.signInResponseHelper.returnUnAuthorized(
        'Incorrect email or password',
      );
    }

    const pwMatches = await argon2.verify(user.password, password);
    if (!pwMatches) {
      this.signInResponseHelper.returnUnAuthorized(
        'Incorrect email or password',
      );
    }

    if (!user.isVerified) {
      this.signInResponseHelper.returnBadRequest('Email not verified');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    return this.signInResponseHelper.returnSuccessObject(
      'Logged in successfully',
      {
        token,
      },
    );
  }

  async verifyAccount(dto: VerifyOtpDto): Promise<ResponseModel<undefined>> {
    const { otp, token } = dto;

    const jwtResponse = this.jwtService.verify(token);

    if (jwtResponse == null) {
      this.verifyResponseHelper.returnBadRequest('OTP expired');
    }

    const { otp: jwtOtp, userId } = jwtResponse;

    if (jwtOtp != otp) {
      this.verifyResponseHelper.returnBadRequest('Incorrect OTP');
    }

    const user = await this.prisma.user.update({
      data: {
        isVerified: true,
      },
      where: {
        id: userId,
      },
    });

    if (user == null) {
      this.verifyResponseHelper.returnInternalServer('User not found');
    }

    return this.verifyResponseHelper.returnSuccessObject(
      'Account verified. You can now log in.',
    );
  }
}
