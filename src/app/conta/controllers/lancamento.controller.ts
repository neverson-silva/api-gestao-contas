import { ILancamentoService } from '@app/conta/interfaces/lancamento.service.interface';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LancamentoDTO } from '@app/conta/dtos/lancamento.dto';
import { User } from '@decorators/usuario.decorator';
import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Lancamento } from '@app/conta/models/lancamento.entity';

@Controller({ version: '1', path: 'lancamentos' })
@ApiTags('Lançamentos do Mês')
@ApiBearerAuth()
export class LancamentoController {
  constructor(
    @Inject('ILancamentoService')
    private readonly lancamentoService: ILancamentoService,
  ) {}

  @Post()
  @ApiOkResponse({
    description: 'Cadastrar um lançamento',
    type: Lancamento,
  })
  async cadastrarLancamento(
    @Body() params: LancamentoDTO,
  ): Promise<Lancamento> {
    const lancamento = await this.lancamentoService.salvar(params);
    return lancamento;
  }

  @Put(':idLancamento')
  @HttpCode(HttpStatus.NO_CONTENT)
  async atualizarLancamento(
    @Param('idLancamento') idLancamento: number,
    @Body() params: LancamentoDTO,
    @User() usuario: UsuarioAutenticadoDto,
  ): Promise<void> {
    await this.lancamentoService.atualizar(idLancamento, params, usuario);
  }

  @Delete(':idLancamento')
  @HttpCode(HttpStatus.NO_CONTENT)
  async apagarLancamento(
    @Param('idLancamento') idLancamento: number,
  ): Promise<void> {
    await this.lancamentoService.apagar(idLancamento);
  }
}
