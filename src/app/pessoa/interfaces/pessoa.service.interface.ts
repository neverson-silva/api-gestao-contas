import { PessoaDto } from '@app/pessoa/dtos/pessoa.dto';

export interface IPessoaService {
  enviarFotoPerfil(
    foto: Express.Multer.File,
    idPessoa: number,
  ): Promise<string>;
  atualizarPessoa(
    id: number,
    atualizarDto: PessoaDto,
    fotoPerfil?: Express.Multer.File,
  ): Promise<void>;
}
