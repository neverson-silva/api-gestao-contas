import { IsEmail, IsNotEmpty } from 'class-validator';

export class UsuarioDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Favor informar um e-mail válido' })
  conta: string;

  @IsNotEmpty({ message: 'Senha é um campo obrigatório' })
  senha: string;

  //   fotoPerfil?: Buffer;

  //   pessoaId: number;
}
