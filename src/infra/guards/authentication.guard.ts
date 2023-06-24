import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { IAutenticacaoService } from '@app/autenticacao/interfaces/autenticacao.service';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('IAutenticacaoService')
    private readonly auth: IAutenticacaoService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicAction = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublicAction) {
      return true;
    }

    const isPublicClass = this.reflector.get<boolean>(
      'isPublic',
      context.getClass(),
    );
    if (isPublicClass) {
      return true;
    }
    return this.isAuthenticated(context);
  }

  async isAuthenticated(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const user = await this.auth.validarToken(
      headers['authorization']?.replace('Bearer ', ''),
    );
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    const usuario = new UsuarioAutenticadoDto(user?.usuario ?? user);
    usuario.roles = usuario.roles.map((role) => role['authority'] ?? role);

    request.usuario = usuario;
    return true;
  }
}
