import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseModel {
  @ApiProperty({
    description: 'Token to be returned with otp for verification',
    title: 'Registration Response Token',
  })
  token: string;
}

export class SignInResponseModel {
  @ApiProperty({
    description: 'Token to be returned with otp for verification',
    title: 'Registration Response Token',
  })
  token: string;
}
