import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { ResumoFaturaPessoas } from '@app/conta/dtos/resumo-faturas';
import { ResumoFormaPagamentoMensalResponseDTO } from '@app/conta/dtos/resumo-forma-pagamento-mensal-response.dto';
import { IResumoFaturaService } from '@app/conta/interfaces/resumo-fatura.service';
import { GastosFormaPagamentoMesAnoDTO } from '@app/dashboard/dtos/gastos-forma-pagamento-mes-ano.dto';
import { GastosPessoaMesAnoDTO } from '@app/dashboard/dtos/gastos-pessoa-mes-ano.dto';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { User } from '@decorators/usuario.decorator';
import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { IDashboardService } from '@app/dashboard/interfaces/dashboard.service.interface';

@Controller({ version: '1', path: 'dashboard' })
export class DashboardController {
  constructor(
    @Inject('IResumoFaturaService')
    private readonly resumoFaturaService: IResumoFaturaService,
    @Inject('IDashboardService')
    private readonly dashboardService: IDashboardService,
  ) {}

  @Get('resumo-pagamentos/:pessoaId')
  async resumoPagamentos(
    @Param('pessoaId') pessoaId: number,
    @Query() mesAnoDTO: MesAnoDTO,
  ): Promise<ResumoFormaPagamentoMensalResponseDTO> {
    const resumos = await this.resumoFaturaService.buscarResumoPagamentos(
      mesAnoDTO,
      pessoaId,
    );
    return resumos;
  }

  @Get('resumo-fatura-pessoas')
  async resumoFaturaPessoas(
    @Query() mesAnoDTO: MesAnoDTO,
    @User() usuario: UsuarioAutenticadoDto,
  ): Promise<ResumoFaturaPessoas[]> {
    const resumos = await this.resumoFaturaService.resumoFaturaPessoas(
      mesAnoDTO,
      usuario,
    );
    return resumos;
  }
  @Get('grafico/gastos-por-pessoa')
  async graficoGastosPorPessoa(
    @Query() mesAnoDTO: MesAnoDTO,
    @User() usuario: UsuarioAutenticadoDto,
  ): Promise<GastosPessoaMesAnoDTO[]> {
    const resultado =
      await this.dashboardService.somarValoresCadaPessoaMesesAnteriores(
        mesAnoDTO,
        8,
        true,
        usuario.ifNotAdminGetPessoa(),
      );
    return resultado;
  }
  @Get('grafico/gastos-por-pessoa/:pessoaId')
  async graficoGastosPorPessoaPorId(
    @Param('pessoaId') pessoaId: number,
    @Query() mesAnoDTO: MesAnoDTO,
  ): Promise<GastosPessoaMesAnoDTO[]> {
    const resultado =
      await this.dashboardService.somarValoresCadaPessoaMesesAnteriores(
        mesAnoDTO,
        5,
        true,
        { id: pessoaId } as Pessoa,
      );
    return resultado;
  }
  @Get('grafico/gastos-por-cartao')
  async dadosGraficoGastorPorFormaPagamento(
    @Query() mesAnoDTO: MesAnoDTO,
  ): Promise<GastosFormaPagamentoMesAnoDTO[]> {
    const resultado = await this.dashboardService.criarGraficoFormaPagamento(
      mesAnoDTO,
      4,
      true,
    );
    return resultado;
  }
}
