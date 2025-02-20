import { Global, Module } from '@nestjs/common';
import { ResponseHelperService } from './response-helper.service';
import {
  RegisterResponseModel,
  SignInResponseModel,
} from 'src/models/authentication.model';
import { JwtModule } from '@nestjs/jwt';
import { UserResponseModel } from 'src/models/user-profile.model';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [
    ResponseHelperService<RegisterResponseModel>,
    ResponseHelperService<SignInResponseModel>,
    ResponseHelperService<UserResponseModel>,
  ],
  exports: [
    ResponseHelperService<RegisterResponseModel>,
    ResponseHelperService<SignInResponseModel>,
    ResponseHelperService<UserResponseModel>,
  ],
})
export class HelperModule {}
