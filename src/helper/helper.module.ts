import { Global, Module } from '@nestjs/common';
import { ResponseHelperService } from './response-helper.service';
import {
  RegisterResponseModel,
  SignInResponseModel,
} from 'src/models/authentication.model';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [
    ResponseHelperService<RegisterResponseModel>,
    ResponseHelperService<SignInResponseModel>,
  ],
  exports: [
    ResponseHelperService<RegisterResponseModel>,
    ResponseHelperService<SignInResponseModel>,
  ],
})
export class HelperModule {}
