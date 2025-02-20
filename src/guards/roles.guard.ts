import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthenticatedRequest } from 'src/schema/request.schema';
import { ResponseHelperService } from 'src/helper/response-helper.service';
import { ROLES_KEY } from './decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly responseHelper: ResponseHelperService<string>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = req.user;

    if (!user) {
      this.responseHelper.returnUnAuthorized('User not authenticated');
      return false;
    }

    const hasRole = requiredRoles.includes(user.isAdmin ? 'admin' : 'user');
    if (!hasRole) {
      this.responseHelper.returnForbidden(
        'You do not have permission to access this resource',
      );
      return false;
    }

    return true;
  }
}
