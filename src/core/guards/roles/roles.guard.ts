import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/core/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate( context: ExecutionContext ): boolean  {
    const roles = this.reflector.getAllAndOverride<String[]>(Roles, [
      context.getHandler(),
      context.getClass()
    ])

    const request = context.switchToHttp().getRequest()
    const user = request.user

    const role = roles.find((role) => {
      return role == user.role
    }) 

    if (!role) {
      return false
    }

    return true
  }
}
