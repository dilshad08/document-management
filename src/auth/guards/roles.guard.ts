// auth/roles.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // User data from the JwtAuthGuard

    const requiredRoles = this.getRolesFromContext(context);
    if (
      requiredRoles &&
      requiredRoles.length > 0 &&
      !requiredRoles.includes(user?.role)
    ) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    return true;
  }

  private getRolesFromContext(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    const roles = Reflect.getMetadata('roles', handler);
    return roles;
  }
}
