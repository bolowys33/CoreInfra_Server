import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  @ApiProperty({
    title: 'Account Fullname',
    description:
      'Full Name of User to be created. Seperate each name by whitespace',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  @ApiProperty({
    title: 'Account Email',
    description: 'Email of User to be created',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20, { message: 'Password has to be between 3 and 20 chars' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is weak',
  })
  @ApiProperty({
    title: 'Account Password',
    description: 'Password of account to be created',
  })
  password: string;
}

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Account Email',
    description: 'Email of the user attempting to sign in',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Account Password',
    description: 'Password of the user attempting to sign in',
  })
  password: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Verification Token',
    description: 'Token for verifying OTP',
  })
  token: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters' })
  @ApiProperty({
    title: 'OTP Code',
    description: 'One-time password sent to the user',
  })
  otp: string;
}
