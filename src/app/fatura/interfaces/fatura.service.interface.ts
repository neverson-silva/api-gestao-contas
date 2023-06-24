import { AppPaginationDTO } from '@utils/dtos/pagination.dto';
import { Page } from '@utils/dtos/page.dto';
import { FaturaItem } from '@app/fatura/models/fatura-item.entity';
import { BuscarLancamentosFaturaRequestDTO } from '@app/fatura/dtos/buscar-lancamentos-fatura-request.dto';
import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';

export interface IFaturaService {
  buscarItensFaturaAtual(
    paginationDTO: AppPaginationDTO,
    usuario: UsuarioAutenticadoDto,
  ): Promise<Page<FaturaItem>>;

  fecharFatura(): Promise<void>;

  buscarItensFatura(
    paramsRequest: BuscarLancamentosFaturaRequestDTO,
    usuario: UsuarioAutenticadoDto,
  ): Promise<Page<FaturaItem>>;

  somarTotalFatura(
    paginationDTO: BuscarLancamentosFaturaRequestDTO,
    usuario: UsuarioAutenticadoDto,
  ): Promise<number>;
}
