import { UsuarioAutenticadoDto } from '@app/autenticacao/dtos/usuario-autenticado.dto';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { MesAnoChartDTO } from '../dtos/mes-ano-chart.dto';
import { MesAnoDTO } from '../dtos/mes-ano.dto';
import { ResumoFaturaPessoas } from '../dtos/resumo-faturas';
import { ResumoFormaPagamentoMensalResponseDTO } from '../dtos/resumo-forma-pagamento-mensal-response.dto';
import { ResumoFatura } from '../models/resumo-fatura.entity';

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
