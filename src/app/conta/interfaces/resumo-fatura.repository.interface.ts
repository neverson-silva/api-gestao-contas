import { MesAnoChartDTO } from '@app/conta/dtos/mes-ano-chart.dto';
import { ResumoFatura } from '@app/conta/models/resumo-fatura.entity';
import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { IRepository } from '@infra/interfaces/repository';

export interface IResumoFaturaRepository extends IRepository<ResumoFatura> {
  findAllByPessoaIdAndMesAndAno(
    idPessoa: number,
    mes: number,
    ano: number,
  ): Promise<ResumoFatura[]>;

  findAllBydMesAndAno(mes: number, ano: number): Promise<ResumoFatura[]>;

  findByMesAndAnoAndPessoas(
    mes: number,
    ano: number,
    idsPessoa: number[],
  ): Promise<ResumoFatura[]>;

  buscarResumoFaturasPorMesAnos(
    meses: MesAnoChartDTO[],
    pessoa: Pessoa,
  ): Promise<ResumoFatura[]>;

  buscarResumos(
    mes: number,
    ano: number,
    idFormaPagamento: number,
    idPessoa?: number,
  ): Promise<ResumoFatura[]>;
}
