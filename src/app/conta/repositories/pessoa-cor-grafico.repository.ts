import { IPessoaCorGraficoRepository } from '@app/conta/interfaces/pessoa-cor-grafico.repository.interface';
import { PessoaCorGrafico } from '@app/conta/models/pessoa-cor-grafico.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class PessoaCorGraficoRepository
  extends Repository<PessoaCorGrafico>
  implements IPessoaCorGraficoRepository
{
  constructor(em: EntityManager) {
    super(PessoaCorGrafico, em);
  }
  async obterTudo(): Promise<PessoaCorGrafico[]> {
    const pessoasCorGrafico = await this.find({
      join: {
        alias: 'pcg',
        innerJoinAndSelect: {
          pessoa: 'pcg.pessoa',
        },
      },
      order: {
        id: 'ASC',
      },
    });
    return pessoasCorGrafico;
  }
}
