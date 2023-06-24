import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { OmitType } from '@nestjs/swagger';
import { Usuario } from '../models/usuario.entity';

export class PessoaUsuarioAutenticadoDTO extends OmitType(Pessoa, [
  'createdAt',
  'updatedAt',
  'nomeCompleto',
]) {}

export class UsuarioAutenticadoDto extends OmitType(Usuario, [
  'pessoa',
  'pessoa',
  'updatedAt',
  'createdAt',
  'compararSenha',
  'criptografarSenha',
  'regras',
  'senha',
  'isAdmin',
  'isGranted',
  'isNotAdmin',
  'isNotGranted',
]) {
  pessoa: PessoaUsuarioAutenticadoDTO;
  roles: string[];

  constructor(obj?: Partial<UsuarioAutenticadoDto | Usuario>) {
    super(obj);
    if (obj) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const usuario = obj?.usuario ?? obj;
      Object.assign(this, usuario);
    }
  }

  hasRole(...roles: string[]): boolean {
    return this.roles.some((role) => roles.includes(role));
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  ifNotAdminGetPessoa(): Pessoa | null {
    if (!this.isAdmin()) {
      return this.pessoa as Pessoa;
    }
    return null;
  }
}
