import { PessoaDto } from '@app/pessoa/dtos/pessoa.dto';
import { IPessoaRepository } from '@app/pessoa/interfaces/pessoa.repository.interface';
import { IPessoaService } from '@app/pessoa/interfaces/pessoa.service.interface';
import { IStorage } from '@app/storage/interfaces/storage.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PessoaService implements IPessoaService {
  constructor(
    @Inject('IPessoaRepository')
    private readonly pessoaRepository: IPessoaRepository,
    @Inject('IStorage')
    private readonly storage: IStorage,
  ) {}

  async atualizarPessoa(
    id: number,
    atualizarDto: PessoaDto,
    fotoPerfil?: Express.Multer.File,
  ): Promise<void> {
    const pessoa = await this.pessoaRepository.findOneBy({ id });
    this.pessoaRepository.merge(pessoa, atualizarDto);

    if (fotoPerfil) {
      await this.enviarFotoPerfil(fotoPerfil, id);
    }
    await this.pessoaRepository.save(pessoa);
  }
  async enviarFotoPerfil(
    foto: Express.Multer.File,
    idPessoa: number,
  ): Promise<string> {
    const pessoa = await this.pessoaRepository.findOneBy({ id: idPessoa });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    const { url } = await this.storage.upload(foto);

    pessoa.fotoPerfil = url;

    await this.pessoaRepository.save(pessoa);

    return url;
  }
}
