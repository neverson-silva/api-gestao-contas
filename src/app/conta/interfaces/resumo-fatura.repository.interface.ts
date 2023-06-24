import { Pessoa } from '@app/pessoa/models/pessoa.entity';
import { IRepository } from 'src/infra/interfaces/repository';
import { MesAnoChartDTO } from '../dtos/mes-ano-chart.dto';
import { ResumoFatura } from '../models/resumo-fatura.entity';

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
