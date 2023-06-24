import { MesAnoDTO } from '@app/conta/dtos/mes-ano.dto';
import { GastosFormaPagamentoMesAnoDTO } from '@app/dashboard/dtos/gastos-forma-pagamento-mes-ano.dto';
import { GastosPessoaMesAnoDTO } from '@app/dashboard/dtos/gastos-pessoa-mes-ano.dto';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';

export interface IDashboardService {
  criarGraficoFormaPagamento(
    mesAnoFinal: MesAnoDTO,
    numeroMeses: number,
    contarAtual: boolean,
    pessoa?: Pessoa,
  ): Promise<GastosFormaPagamentoMesAnoDTO[]>;

  somarValoresCadaPessoaMesesAnteriores(
    mesAnoFinal: MesAnoDTO,
    numeroMeses: number,
    contarAtual: boolean,
    pessoa?: Pessoa,
  ): Promise<GastosPessoaMesAnoDTO[]>;
}
