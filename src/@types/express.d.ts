import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';

declare global {
  namespace Express {
    export interface Request {
      usuario: UsuarioAutenticadoDto;
    }
  }
}
