import { IMesRepository } from '@app/conta/interfaces/mes.repository.interface';
import { IResumoFaturaRepository } from '@app/conta/interfaces/resumo-fatura.repository.interface';
import { ResumoFatura } from '@app/conta/models/resumo-fatura.entity';
import { IPessoaRepository } from '@app/pessoa/interfaces/pessoa.repository.interface';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { PessoaComValorDespesaDto } from '@app/pessoa/pessoa-com-valor-despesa.dto';
import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mesUtil } from '@utils/meses';
import { numberUtils } from '@utils/number';
import { IPessoaService } from '@app/pessoa/interfaces/pessoa.service.interface';

@Controller({ version: '1', path: 'pessoas' })
export class PessoaController {
  constructor(
    @Inject('IPessoaRepository')
    private readonly pessoaRepository: IPessoaRepository,
    @Inject('IMesRepository')
    private readonly mesRepository: IMesRepository,
    @Inject('IResumoFaturaRepository')
    private readonly resumoFaturaRepository: IResumoFaturaRepository,
    @Inject('IPessoaService')
    private readonly pessoService: IPessoaService,
  ) {}

  @Get()
  async getPessoas(): Promise<PessoaComValorDespesaDto[]> {
    const mesAtual = await this.mesRepository.findOneBy({ atual: true });
    const mesAno = mesUtil.getMesAno(mesAtual);

    const pessoas = await this.pessoaRepository.find({
      order: {
        nome: 'ASC',
      },
    });
    const resumos = await this.resumoFaturaRepository.buscarResumos(
      mesAno.mesReferencia,
      mesAno.anoReferencia,
      null,
      null,
    );

    const resumosAgrupados = resumos.groupBy<Pessoa, ResumoFatura>(
      (res) => res.pessoa,
    );

    return pessoas.map((pessoa) => {
      const valorTotal = numberUtils.somar(
        resumosAgrupados.take(pessoa)?.map((resumo) => resumo?.valorTotal),
      );
      return new PessoaComValorDespesaDto(valorTotal, pessoa);
    });
  }

  @Patch('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async alterarFoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ): Promise<string> {
    try {
      return await this.pessoService.enviarFotoPerfil(file, id);
    } catch (err) {
      console.error(err);
      throw new BadRequestException('tente mais tarde');
    }
  }
}
