import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ITotalPessoaService } from '../interfaces/total-pessoa.service.interface';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { TotalPessoa } from '../models/total-pessoa.entity';

@Controller({ version: '1', path: 'total-pessoas' })
export class TotalPessoaController {
  constructor(
    @Inject('ITotalPessoaService')
    private readonly totalPessoaService: ITotalPessoaService,
  ) {}

  @Get()
  async buscarTotais(@Query() mesAnoDto: MesAnoDTO): Promise<TotalPessoa[]> {
    return await this.totalPessoaService.buscarTotaisPorMesAno(mesAnoDto);
  }
}
