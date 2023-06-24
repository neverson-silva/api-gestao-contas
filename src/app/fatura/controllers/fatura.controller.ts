import { Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { Page } from '@utils/dtos/page.dto';
import { FaturaItem } from '@app/fatura/models/fatura-item.entity';
import { AppPaginationDTO } from '@utils/dtos/pagination.dto';
import { IFaturaService } from '@app/fatura/interfaces/fatura.service.interface';
import { BuscarLancamentosFaturaRequestDTO } from '@app/fatura/dtos/buscar-lancamentos-fatura-request.dto';
import { ConsultaItensFaturaResponseDTO } from '@app/fatura/dtos/consulta-itens-fatura-response.dto';
import { User } from '@decorators/usuario.decorator';
import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';

@Controller({ version: '1', path: 'faturas' })
export class FaturaController {
  constructor(
    @Inject('IFaturaService')
    private readonly faturaService: IFaturaService,
  ) {}
  @Get('fatura-atual')
  async buscarItensFaturaAtual(
    @Query() paginationDTO: AppPaginationDTO,
    @User() usuario: UsuarioAutenticadoDto,
  ): Promise<Page<FaturaItem>> {
    const itens = await this.faturaService.buscarItensFaturaAtual(
      paginationDTO,
      usuario,
    );
    return itens;
  }

  /*
   * @todo nao testaqdo ainda na web
   * */
  @Post('fechar')
  async fechar(): Promise<void> {
    await this.faturaService.fecharFatura();
  }

  @Get('buscar-itens-fatura')
  async buscarItensFatura(
    @Query() paginationDTO: BuscarLancamentosFaturaRequestDTO,
    @User() usuario: UsuarioAutenticadoDto,
  ): Promise<ConsultaItensFaturaResponseDTO> {
    const itens = await this.faturaService.buscarItensFatura(
      paginationDTO,
      usuario,
    );
    const totalFatura = await this.faturaService.somarTotalFatura(
      paginationDTO,
      usuario,
    );
    const response = new ConsultaItensFaturaResponseDTO(totalFatura, itens);
    return response;
  }
}
