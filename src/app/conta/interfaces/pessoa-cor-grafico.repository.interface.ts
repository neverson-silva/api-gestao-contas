import { IRepository } from '@infra/interfaces/repository';
import { PessoaCorGrafico } from '../models/pessoa-cor-grafico.entity';

export interface IPessoaCorGraficoRepository
  extends IRepository<PessoaCorGrafico> {
  obterTudo(): Promise<PessoaCorGrafico[]>;
}
