import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const actionRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    const classRoles = this.reflector.get<string[]>(
      'roles',
      context.getClass(),
    );

    let roles: any[];

    if (!actionRoles && !classRoles) {
      return true;
    } else if (actionRoles) {
      roles = actionRoles;
    } else {
      roles = classRoles;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    return this.isAuthorized(user, roles);
  }

  /**
   * Verificar se um usuário possui permissão de acesso a um recurso
   * @param usuario
   * @param roles
   * @returns boolean
   */
  isAuthorized(usuario, roles: string[]): boolean {
    if (!usuario) {
      return false;
    }

    const userRoles = usuario?.roles as any[];

    const found: boolean = roles.some((role) => userRoles.includes(role));

    return userRoles.length && found;
  }
}
