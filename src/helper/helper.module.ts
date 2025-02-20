import { Global, Module } from '@nestjs/common';
import { ResponseHelperService } from './response-helper.service';
import {
  RegisterResponseModel,
  SignInResponseModel,
} from 'src/models/authentication.model';
import { JwtModule } from '@nestjs/jwt';
import { UserResponseModel } from 'src/models/user-profile.model';
import { CardSchemeModel } from 'src/models/card-scheme.model';
import { CardProfileModel } from 'src/models/card-profile.model';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [
    ResponseHelperService<RegisterResponseModel>,
    ResponseHelperService<SignInResponseModel>,
    ResponseHelperService<UserResponseModel>,
    ResponseHelperService<CardSchemeModel>,
    ResponseHelperService<CardProfileModel>,
  ],
  exports: [
    ResponseHelperService<RegisterResponseModel>,
    ResponseHelperService<SignInResponseModel>,
    ResponseHelperService<CardSchemeModel>,
    ResponseHelperService<UserResponseModel>,
    ResponseHelperService<CardProfileModel>,
  ],
})
export class HelperModule {}
