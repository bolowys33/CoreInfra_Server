import { Injectable, ExecutionContext, CanActivate, Global } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedRequest } from 'src/schema/request.schema';

@Global()
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly responseHelper: ResponseHelperService<string>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      this.responseHelper.returnUnAuthorized('Missing or invalid token');
      return false;
    }

    const token = authHeader.split(' ')[1];

    const payload = this.jwtService.verify(token);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      this.responseHelper.returnUnAuthorized('User not found');
      return false;
    }

    req.user = user;
    return true;
  }
}
