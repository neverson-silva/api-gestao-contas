import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { UsuarioDto } from '@app/autenticacao/dtos/usuario.dto';
import { IAutenticacaoService } from '@app/autenticacao/interfaces/autenticacao.service';
import { IUsuarioRepository } from '@app/autenticacao/interfaces/usuario.repository';
import { Usuario } from '@app/autenticacao/models/usuario.entity';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AutenticacaoService implements IAutenticacaoService {
  public static TOKEN_HEADER = 'authorization';
  public static TOKEN_PREFIX = 'Bearer ';
  public static EXPIRATION_TIME = '1d';

  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly configService: ConfigService,
  ) {}

  async autenticar(
    usuarioDto: UsuarioDto,
  ): Promise<Usuario & { accessToken: string; refreshToken: string }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { email: usuarioDto.conta },
      relations: {
        pessoa: true,
        regras: true,
      },
    });

    if (!usuario || !(await usuario.compararSenha(usuarioDto.senha))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      id: usuario?.id,
      email: usuario?.email,
      situacao: usuario?.situacao,
      pessoa: {
        id: usuario?.pessoa?.id,
        nome: usuario?.pessoa?.nome,
        sobrenome: usuario?.pessoa?.sobrenome,
        apelido: usuario?.pessoa?.apelido,
        perfil: usuario?.pessoa?.perfil,
        sexo: usuario?.pessoa?.sexo,
        dataNascimento: usuario?.pessoa?.dataNascimento,
      },
      roles: usuario?.regras,
    };

    const secret = this.configService.getAt('app.auth.secret');
    const options = this.configService.getAt('app.auth.signOptions');

    const accessToken = await jwt.sign({ usuario: payload }, secret, options);

    return {
      ...payload,
      accessToken,
      refreshToken: '',
    } as any;
  }

  async validarToken(token: string): Promise<UsuarioAutenticadoDto | null> {
    let claims;
    try {
      claims = await jwt.verify(
        token,
        this.configService.getAt('app.auth.secret'),
      );
    } catch (e) {
      Logger.error(e.message, e.stackTrace);
      return null;
    }

    return new UsuarioAutenticadoDto(claims);
  }
}
