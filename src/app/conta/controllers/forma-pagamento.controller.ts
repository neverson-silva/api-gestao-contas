import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { IFormaPagamentoService } from '@app/conta/interfaces/forma-pagamento.service.interface';
import { FormaPagamento } from '@app/conta/models/forma-pagamento.entity';
import { User } from '@decorators/usuario.decorator';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { mesUtil } from '@utils/meses';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller({ version: '1', path: 'formas-pagamentos' })
@ApiTags('Formas de Pagamento ')
@ApiBearerAuth()
export class FormaPagamentoController {
  constructor(
    @Inject('IFormaPagamentoService')
    private readonly formaPagamentoService: IFormaPagamentoService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Obter formas de apgamentos',
    type: FormaPagamento,
    isArray: true,
  })
  async getFormasPagamentos(
    @User() usuario: UsuarioAutenticadoDto,
  ): Promise<FormaPagamento[]> {
    if (usuario.isAdmin()) {
      return await this.formaPagamentoService.buscarFormasPagamentosAtivasAdmin();
    }
    return await this.formaPagamentoService.buscarFormasPagamentosDono(
      usuario.pessoa.id,
    );
  }

  @Get('buscar-com-compras')
  @ApiOkResponse({
    description: 'Buscar compras que possui formas de pagamentos',
    type: FormaPagamento,
    isArray: true,
  })
  async buscarFormasPagamentosComCompras(
    @Query() requestParams: MesAnoDTO,
    @User() usuario: UsuarioAutenticadoDto,
  ): Promise<FormaPagamento[]> {
    const pessoa = usuario.ifNotAdminGetPessoa();

    const mesAnoReferencia = mesUtil.getMesAnoReferencia({
      mes: requestParams.mesReferencia,
      ano: requestParams.anoReferencia,
    });

    return await this.formaPagamentoService.buscarFormasPagamentosComCompras(
      mesAnoReferencia.mesReferencia,
      mesAnoReferencia.anoReferencia,
      pessoa,
    );
  }
}
