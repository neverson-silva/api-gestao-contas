import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { MesAnoChartDTO } from '@app/conta/dtos/mes-ano-chart.dto';
import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { ResumoFaturaPessoas } from '@app/conta/dtos/resumo-faturas';
import { ResumoFormaPagamentoMensalResponseDTO } from '@app/conta/dtos/resumo-forma-pagamento-mensal-response.dto';
import { ResumoFatura } from '@app/conta/models/resumo-fatura.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';

export interface IResumoFaturaService {
  buscarResumoPagamentos(
    mesAnoDTO: MesAnoDTO,
    idPessoa: number,
  ): Promise<ResumoFormaPagamentoMensalResponseDTO>;

  buscarResumoPagamentosMesAtual(
    idPessoa: number,
  ): Promise<ResumoFormaPagamentoMensalResponseDTO>;

  resumoFaturaPessoas(
    mesAnoDTO: MesAnoDTO,
    usuario: UsuarioAutenticadoDto,
  ): Promise<ResumoFaturaPessoas[]>;

  buscarResumoFaturasPorMesAnos(
    meses: MesAnoChartDTO[],
    pessoa: Pessoa,
  ): Promise<ResumoFatura[]>;
}
