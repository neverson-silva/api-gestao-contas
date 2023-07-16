import { PessoaCorGrafico } from '@app/conta/models/pessoa-cor-grafico.entity';
import { IRepository } from '@infra/interfaces/repository';

export interface IPessoaCorGraficoRepository
  extends IRepository<PessoaCorGrafico> {
  obterTudo(): Promise<PessoaCorGrafico[]>;
}
