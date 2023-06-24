import { UsuarioDto } from '../dtos/usuario.dto';
import { Usuario } from '@app/autenticacao/models/usuario.entity';

export interface IAutenticacaoService {
  autenticar(
    user: UsuarioDto,
  ): Promise<Usuario & { accessToken: string; refreshToken: string }>;
  validarToken(token: string): Promise<any>;
}
